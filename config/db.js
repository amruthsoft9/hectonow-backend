const sqlite3 = require("sqlite3").verbose();

// ✅ Connect to SQLite Database
const db = new sqlite3.Database("./users.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("❌ Database Connection Error:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to SQLite database");
});

module.exports = db;
