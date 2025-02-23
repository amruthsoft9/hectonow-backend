require("dotenv").config();
const mysql = require("mysql2");

// ✅ Create MySQL connection
const db = mysql.createConnection({
    host: "82.29.152.237",
    user: "akhil",
    password:"12345",
    database:"yoodb"
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
