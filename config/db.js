require("dotenv").config();
const mysql = require("mysql2");

// ✅ Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_password,
    database:process.env.DB_DATABASE
});

// ✅ Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

module.exports = db;
