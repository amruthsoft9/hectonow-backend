const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const morgan = require("morgan");

dotenv.config();

const app = express();

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        process.exit(1);
    } else {
        console.log("Database connected");
    }
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Import Routes
const authRoutes = require("./routes/authRoutes");


app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running");
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
