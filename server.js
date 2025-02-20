const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in environment variables");
  process.exit(1);
}

const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Connect to SQLite Database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// 🛠 MIGRATION: Alter users table
const migrateUsersTable = () => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION"); // Start transaction

    db.run("ALTER TABLE users RENAME TO users_old", (err) => {
      if (err) console.error("❌ Error renaming table:", err.message);
    });

    db.run(
      `CREATE TABLE users (
        id INTEGER PRIMARY KEY, 
        firstName TEXT NOT NULL, 
        lastName TEXT NOT NULL, 
        username TEXT UNIQUE, 
        phone TEXT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL
      )`,
      (err) => {
        if (err) console.error("❌ Error creating new users table:", err.message);
      }
    );

    db.run(
      `INSERT INTO users (id, firstName, lastName, phone, email, password)
       SELECT id, 
              COALESCE(SUBSTR(fullName, 1, INSTR(fullName, ' ') - 1), 'Unknown') AS firstName, 
              COALESCE(SUBSTR(fullName, INSTR(fullName, ' ') + 1), 'Unknown') AS lastName, 
              phone, email, password 
       FROM users_old`,
      (err) => {
        if (err) console.error("❌ Error copying data:", err.message);
      }
    );

    db.run("DROP TABLE users_old", (err) => {
      if (err) console.error("❌ Error dropping old table:", err.message);
    });

    db.run("COMMIT"); // Commit transaction
    console.log("✅ Database migration completed successfully");
  });
};

migrateUsersTable();

// ✅ Registration Route (Updated Schema)
app.post("/auth/register", async (req, res) => {
  console.log("📩 Received Data:", req.body);

  const { firstName, lastName, username, phone, email, password } = req.body;

  if (!firstName || !lastName || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, username, phone, email, hashedPassword],
      function (err) {
        if (err) {
          console.error("❌ Database Error:", err.message);
          return res.status(500).json({ error: "Database error" });
        }
        console.log("✅ User inserted with ID:", this.lastID);
        res.status(201).json({ message: "User registered successfully", userId: this.lastID });
      }
    );
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// ✅ Login Route
app.post("/auth/login", (req, res) => {
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
      process.env.JWT_SECRET,
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "Access granted", user: decoded });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// ✅ Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
