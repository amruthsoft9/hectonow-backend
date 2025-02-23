const connection = require("../config/db");

const Seller = {
  create: (sellerData, callback) => {
    const sql = `INSERT INTO sellers (firstName, lastName, username, phone, email, password, shopName) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      sellerData.firstName,
      sellerData.lastName,
      sellerData.username,
      sellerData.phone,
      sellerData.email,
      sellerData.password, // Hash before storing!
      sellerData.shopName,
    ];

    connection.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  },

  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM sellers WHERE email = ?`;
    connection.query(sql, [email], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result[0]);
    });
  },
};

module.exports = Seller;
