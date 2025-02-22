const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

// ✅ Function to generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err.message);
                return res.json({ success: false, message: "Database error" });
            }
            if (results.length === 0) {
                return res.json({ success: false, message: "Invalid email or password" });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid email or password" });
            }

            const token = generateToken(user.id);
            return res.json({ success: true, token });
        });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.json({ success: false, message: "Server error" });
    }
};

// ✅ User Registration
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, phone, email, password } = req.body;

        if (!firstName || !lastName || !username || !phone || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err.message);
                return res.json({ success: false, message: "Database error" });
            }
            if (results.length > 0) {
                return res.json({ success: false, message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(insertQuery, [firstName, lastName, username, phone, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("❌ Error inserting user:", err.message);
                    return res.json({ success: false, message: "Error inserting user" });
                }

                const token = generateToken(result.insertId);
                return res.json({ success: true, userId: result.insertId, token });
            });
        });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.json({ success: false, message: "Server error" });
    }
};

// ✅ Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });
            return res.json({ success: true, token, isAdmin: true });
        }

        return res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { loginUser, registerUser, adminLogin };
