const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const validator = require("validator");

const db = new sqlite3.Database("./users.db");

// ✅ Function to generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  };


// Route for user Login
const loginUser = async(req,res) => {
    try {
        const {email,password} = req.body;
        // check all fields are provided
        if (!email || !password ) {
            return res.json({success:false,message:"Email and password are required"});
        }
 // ✅ Check if the user exists
 db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.json({ success: false, message: "Database error" });
    }
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = generateToken(user.id);

    // ✅ Send response with token
    return res.json({ success: true, token });
  });

    } catch(error) { 
        console.log("server error:",error.message)
        res.json({success:false,message:""})
    }
}

// ✅ User Registration Function
const registerUser = async (req, res) => {
    try {
      const { firstName, lastName, username, phone, email, password } = req.body;
  
      // Check if all fields are provided
      if (!firstName || !lastName || !username || !phone || !email || !password) {
        return res.json({ success: false, message: "All fields are required" });
      }
  
      // Check if email already exists
      db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
        if (err) {
          console.error("❌ Database Error:", err.message);
          return res.json({ success: false, message: "Database error" });
        }
        if (row) {
          return res.json({ success: false, message: "Email already exists" });
        }
  
        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        // ✅ Insert user into database
        const insertQuery = `INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(insertQuery, [firstName, lastName, username, phone, email, hashedPassword], function (err) {
          if (err) {
            console.error("❌ Error inserting user:", err.message);
            return res.json({ success: false, message: "Error inserting user" });
          }
  
          // ✅ Generate JWT Token
          const token = generateToken(this.lastID);
  
          // ✅ Send response with token
          return res.json({ success: true, userId: this.lastID, token });
        });
      });
    } catch (error) {
      console.error("❌ Server Error:", error.message);
      res.json({ success: false, message: "Server error" });
    }
  };

// Route for admin login

const adminLogin = async(req,res) => {
    try {
        const { email, password } = req.body;
    
        // ✅ Check if credentials match environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          
          // ✅ Create a token with an admin flag
          const token = jwt.sign(
            { email, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token expires in 7 days
          );
    
          return res.json({ success: true, token, isAdmin: true });
        } 
    
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
      }
}


module.exports = { loginUser,registerUser,adminLogin }
