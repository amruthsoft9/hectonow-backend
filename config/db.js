const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    process.exit(1); 
  } else {
    console.log('Database connected as id ' + db.threadId);
  }
});


module.exports = db;

