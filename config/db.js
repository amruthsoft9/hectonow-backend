const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite Database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// 🛠 Ensure `users` table exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    firstName TEXT NOT NULL, 
    lastName TEXT NOT NULL, 
    username TEXT UNIQUE NOT NULL, 
    phone TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    cartData TEXT DEFAULT '{}'
  )
`, (err) => {
  if (err) {
    console.error("❌ Error creating users table:", err.message);
  } else {
    console.log("✅ Users table is ready");
  }
});

// Export the database instance
module.exports = db;
