const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); 


exports.registerUser = async (req, res) => {
  const { firstName, lastName, username, phone, email, password } = req.body;

  if (!firstName || !lastName || !username || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    db.query(
      "INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, username, phone, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Username or email already exists!" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully!" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Unexpected server error" });
  }
};


exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ error: "User not found!" });
    }

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Login successful!", token, user });
  });
};
