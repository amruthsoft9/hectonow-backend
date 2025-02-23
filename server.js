const express = require("express");
const cors = require("cors");
const mysql = require("mysql2")
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const mysql = require("./config/db");



// App configurations
const app = express();


app.use(express.json()); 


const allowedOrigins = ["http://localhost:5173" , "http://localhost:5174" , "http://localhost:3000"];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


const userRoutes = require("./routes/userRoutes");
const sellerRoutes = require("./routes/sellerRoutes");


app.use("/auth/user", userRoutes);
app.use("/auth/seller", sellerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

