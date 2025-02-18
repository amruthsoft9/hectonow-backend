const express = require("express");
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const morgan = require('morgan');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
dotenv.config();

const app=express();

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

// Connect to the database
db.connect((err) => {
    if(err) {
        console.error('Database connection failed: ' + err.stack);
    } else {
        console.log('Database connected  ');
    }
});
// //middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// //Routes
// app.use('/api/auth',authRoutes);
// app.use('/api/user',userRoutes);

//start the server
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=> {
    console.log(`server is running on port ${PORT}`);
})