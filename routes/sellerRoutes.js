const express = require("express");
const { registerSeller, loginSeller, upload } = require("../controllers/sellerController");

const router = express.Router();

router.post("/register", upload.single("ownerPhoto"), registerSeller);

router.post("/login", loginSeller);

module.exports = router;
