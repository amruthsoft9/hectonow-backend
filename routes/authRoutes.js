const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // ✅ Import your MySQL connection
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Registration Route
router.post("/register", async (req, res) => {
  console.log("Received Data:", req.body);

  const { firstName, lastName, username, phone, email, password } = req.body;

  if (!firstName || !lastName || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, username, phone, email, hashedPassword],
      (err, result) => {
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

// ✅ User Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found!" });
    }

    const user = results[0];

    // Compare hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
      process.env.JWT_SECRET || "defaultsecretkey",
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful", token, user });
  });
});


module.exports = router;
