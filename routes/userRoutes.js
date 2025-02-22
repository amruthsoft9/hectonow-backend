   
const express = require("express");
const { registerUser,loginUser, adminLogin } = require("../controllers/userController");

const router = express.Router();

// User Registration Route (POST)
router.post("/register", registerUser);
router.post("/login",loginUser)
router.post("/admin-login",adminLogin)

module.exports = router;
