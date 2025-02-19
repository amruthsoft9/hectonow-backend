const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// Connect to SQLite Database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// 🛠️ MIGRATION: Alter `users` table
const migrateUsersTable = () => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION"); // Start transaction

    // 1️⃣ Rename old table
    db.run("ALTER TABLE users RENAME TO users_old", (err) => {
      if (err) console.error("❌ Error renaming table:", err.message);
    });

    // 2️⃣ Create new table with updated schema
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY, 
        firstName TEXT NOT NULL, 
        lastName TEXT NOT NULL, 
        username TEXT UNIQUE, 
        phone TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL
      )
    `, (err) => {
      if (err) console.error("❌ Error creating new users table:", err.message);
    });

    // 3️⃣ Copy existing data (default firstName/lastName from fullName)
    db.run(`
      INSERT INTO users (id, firstName, lastName, phone, email, password)
      SELECT id, 
             SUBSTR(fullName, 1, INSTR(fullName, ' ') - 1) AS firstName, 
             SUBSTR(fullName, INSTR(fullName, ' ') + 1) AS lastName, 
             phone, email, password 
      FROM users_old
    `, (err) => {
      if (err) console.error("❌ Error copying data:", err.message);
    });

    // 4️⃣ Drop old table
    db.run("DROP TABLE users_old", (err) => {
      if (err) console.error("❌ Error dropping old table:", err.message);
    });

    db.run("COMMIT"); // Commit transaction
    console.log("✅ Database migration completed successfully");
  });
};

// Call migration function
migrateUsersTable();

// ✅ Registration Route (Updated Schema)
app.post("/register", async (req, res) => {
  console.log("Received Data:", req.body);

  const { firstName, lastName, username, phone, email, password } = req.body;

  if (!firstName || !lastName || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, username, phone, email, hashedPassword],
      function (err) {
        if (err) {
          console.error("❌ Database Error:", err.message);
          return res.status(500).json({ error: "Email or username already exists" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// ✅ Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, username: user.username },
      process.env.JWT_SECRET || "defaultsecretkey",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token, user });
  });
});

// ✅ Protected Route Example
app.get("/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecretkey");
    res.json({ message: "Access granted", user: decoded });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// ✅ Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
