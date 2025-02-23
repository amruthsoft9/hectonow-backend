<<<<<<< HEAD
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 
=======
const connection = require("../config/db");
>>>>>>> 2e0db3b61688422186314c0d6d7480308bbabf4f

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
<<<<<<< HEAD
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cartData: {
    type: DataTypes.JSON, // ✅ Fixed: Use JSON instead of Object
    defaultValue: {} // ✅ Fix: Default should be set using defaultValue
  }
}, {
  tableName: "users",
  timestamps: true
});
=======
};
>>>>>>> 2e0db3b61688422186314c0d6d7480308bbabf4f

module.exports = User;
