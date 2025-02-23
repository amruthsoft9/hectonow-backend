   
const express = require("express");
<<<<<<< HEAD
const { registerUser,loginUser, adminLogin } = require("../controllers/userController");

const router = express.Router();

// User Registration Route (POST)
router.post("/register", registerUser);
router.post("/login",loginUser)
router.post("/admin-login",adminLogin)
=======
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
>>>>>>> 2e0db3b61688422186314c0d6d7480308bbabf4f

module.exports = router;
