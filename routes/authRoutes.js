const express = require("express");
const { loginUser } = require("../controllers/authController"); // Ensure this file exists
const router = express.Router();

router.post("/login", loginUser); // Make sure this route is here
router.get("/test", (req, res) => {
    res.send("Auth API is working!");
});


module.exports = router;
