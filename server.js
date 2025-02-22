const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();
require ("./config/db")


// App configurations
const app = express();
const PORT = process.env.PORT || 5000;

// App middleware
app.use(cors());  
app.use(express.json());

// Api Endpoints
app.use("/api/user",userRouter)

app.get('/',(req,res) =>{
    res.send("APi is working")
});

// const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: ["GET", "POST", "PUT", "DELETE"]
// }));





// ✅ Start Server

app.listen(PORT , () => console.log(`🚀Server running on port ${PORT}`));


