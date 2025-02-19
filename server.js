const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

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

const db = new sqlite3.Database("./users.db");

// Create Users Table
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, fullName TEXT, phone TEXT, email TEXT UNIQUE, password TEXT)");

// Register User
app.post("/register", async (req, res) => {
    console.log("Received Data:", req.body); // Debugging
  
    const { fullName, phone, email, password } = req.body;
  
    if (!fullName || !phone || !email || !password) {
      console.log("Validation Failed: Missing Fields");
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword);
  
      // Insert user into database
      db.run(
        `INSERT INTO users (fullName, phone, email, password) VALUES (?, ?, ?, ?)`,
        [fullName, phone, email, hashedPassword],
        function (err) {
          if (err) {
            console.error("Database Error:", err.message); // Log the exact error
            return res.status(500).json({ error: "Database error", details: err.message });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      console.error("Unexpected Error:", error);
      res.status(500).json({ error: "Unexpected server error" });
    }
  });
  

// Login User
app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user.id, email: user.email, fullName: user.fullName }, "secretkey", { expiresIn: "1h" });
      res.json({ message: "Login successful", token, user });
    });
  });
  

app.listen(5000, () => console.log("Server running on port 5000"));
