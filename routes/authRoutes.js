const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

// ✅ User Registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, username, phone, email, password } = req.body;

  if (!firstName || !lastName || !username || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, username, phone, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Email or username already exists" });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// ✅ User Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "defaultsecretkey", { expiresIn: "2h" });

    res.json({ message: "Login successful", token, user });
  });
});

module.exports = router;
