const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
dotenv.config();

const app=express();

// //middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// //Routes
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

//start the server
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=> {
    console.log(`server is running on port ${PORT}`);
})