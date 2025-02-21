const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // ✅ Make sure this file exists
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ User Registration Route
router.post("/register", async (req, res) => {
  console.log("📩 User Registration Data:", req.body);

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

router.post("/seller/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await db.get("SELECT * FROM sellers WHERE email = ?", [email]);

    if (!seller) {
      return res.status(400).json({ error: "Seller not found!" });
    }

    if (seller.password !== password) {
      return res.status(400).json({ error: "Invalid password!" });
    }

    res.json({ message: "Login successful", seller });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Seller Registration Route
router.post("/auth/seller/register", async (req, res) => {
  console.log("Received Data:", req.body); // ✅ Debugging step

  const { username, name, shopName, email, phone, password, pan, gst, fssai, ownerPhoto } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, Email, and Password are required!" });
  }

  try {
    await db.run("INSERT INTO sellers (username, name, shopName, email, phone, password, pan, gst, fssai, ownerPhoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [username, name, shopName, email, phone, password, pan, gst, fssai, ownerPhoto]);

    res.status(201).json({ message: "Seller registered successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});


// ✅ Seller Login Route
app.post("/auth/seller/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM sellers WHERE email = ?", [email], async (err, seller) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    const isValid = await bcrypt.compare(password, seller.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Send approval status
    res.json({
      message: "Login successful",
      seller: {
        id: seller.id,
        name: seller.name,
        shopName: seller.shopName,
        email: seller.email,
        phone: seller.phone,
        approved: seller.approved,  // ✅ Include approval status
      },
    });
  });
});


// ✅ Get Seller Profile (Protected Route)
router.get("/auth/seller/profile", authMiddleware, (req, res) => {
  db.get("SELECT id, name, shopName, email, phone, approved FROM sellers WHERE id = ?", [req.user.id], (err, seller) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.json({ seller });
  });
});

// ✅ Protected Profile Route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

module.exports = router;
