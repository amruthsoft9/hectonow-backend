const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const mysql = require("../config/db");

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
  limits: { fileSize: 2 * 1024 * 1024 }, 
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

// seller registration

const registerSeller = async (req, res) => {
  try {
    const { username, name, shopName, email, phone, password, pan, gst, fssai, license } = req.body;
    const ownerPhoto = req.file ? req.file.filename : null;

    if (!username || !name || !shopName || !email || !phone || !password || !pan || !gst || !fssai || !license || !ownerPhoto) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    mysql.query(
      "INSERT INTO sellers (username, name, shopName, email, phone, password, pan, gst, fssai, license, ownerPhoto, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [username, name, shopName, email, phone, hashedPassword, pan, gst, fssai, license, ownerPhoto, 0],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Username or email already exists!" });
          }
          console.error("❌ Database Error:", err.message);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Seller registered successfully, pending approval", sellerId: result.insertId });
      }
    );
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
};

const loginSeller = (req, res) => {
  const { email, password } = req.body;

  mysql.query("SELECT * FROM sellers WHERE email = ?", [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Seller not found!" });
    }

    const seller = results[0];

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
};

module.exports = {
  registerSeller,
  loginSeller,
  upload
};
