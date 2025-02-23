const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '82.29.152.237', // Change to 'localhost' if running on the same server
  user: 'yoo',
  password: 'Yoo@123',
  database: 'yoo_db'
});

connection.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

module.exports = connection;


