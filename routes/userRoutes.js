const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/userController"); // ✅ Correct path

router.get("/profile", getUser);
router.put("/profile", updateUser);

module.exports = router;
