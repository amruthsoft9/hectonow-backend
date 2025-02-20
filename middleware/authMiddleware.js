const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "defaultsecretkey");
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
