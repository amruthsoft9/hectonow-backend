const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();


require("./config/db");

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
    credentials: true, // ✅ Allows cookies & authentication headers
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Ensure CORS is applied BEFORE routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only JPG, JPEG, and PNG files are allowed!"));
    }
  }
});

// ✅ Ensure `JWT_SECRET` Exists
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in environment variables");
  process.exit(1);
}

// ✅ Connect to SQLite Database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// ✅ Create Sellers Table
db.run(
  `CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    shopName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    pan TEXT NOT NULL,
    gst TEXT NOT NULL,
    fssai TEXT NOT NULL,
    license TEXT NOT NULL,
    ownerPhoto TEXT NOT NULL,
    approved INTEGER DEFAULT 0
  )`,
  (err) => {
    if (err) console.error("❌ Error creating sellers table:", err.message);
    else console.log("✅ Sellers table ready");
  }
);

// ✅ Seller Registration Route
app.post("/auth/seller/register", upload.single("ownerPhoto"), async (req, res) => {
  try {
    console.log("📩 Received Seller Registration Data:", req.body);
    console.log("📷 Uploaded File:", req.file);

    const { username, name, shopName, email, phone, password, pan, gst, fssai, license } = req.body;
    const ownerPhoto = req.file ? req.file.filename : null;

    if (!username || !name || !shopName || !email || !phone || !password || !pan || !gst || !fssai || !license || !ownerPhoto) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security

    db.run(
      "INSERT INTO sellers (username, name, shopName, email, phone, password, pan, gst, fssai, license, ownerPhoto, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [username, name, shopName, email, phone, hashedPassword, pan, gst, fssai, license, ownerPhoto, 0],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(400).json({ error: "Username or email already exists!" });
          }
          console.error("❌ Database Error:", err.message);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Seller registered successfully, pending approval", sellerId: this.lastID });
      }
    );
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// ✅ Seller Login Route
app.post("/auth/seller/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM sellers WHERE email = ?", [email], async (err, seller) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!seller) {
      return res.status(400).json({ error: "Seller not found!" });
    }

    const isValid = await bcrypt.compare(password, seller.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: seller.id, email: seller.email, name: seller.name, shopName: seller.shopName },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      seller: {
        id: seller.id,
        name: seller.name,
        shopName: seller.shopName,
        email: seller.email,
        phone: seller.phone,
        approved: seller.approved,
      },
    });
  });
});

// ✅ Admin Approve Seller Route
app.put("/admin/approve-seller/:id", (req, res) => {
  const { id } = req.params;

  db.run("UPDATE sellers SET approved = 1 WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json({ message: "Seller approved successfully!" });
  });
});

// ✅ Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
