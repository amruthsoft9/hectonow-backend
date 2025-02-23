const connection = require("../config/db");

const User = {
  create: (userData, callback) => {
    const sql = `INSERT INTO users (firstName, lastName, username, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      userData.firstName,
      userData.lastName,
      userData.username,
      userData.phone,
      userData.email,
      userData.password, // Make sure to hash before storing!
    ];

    connection.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },

  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    connection.query(sql, [email], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result[0]); // Return the first user found
    });
  },
};

module.exports = User;
