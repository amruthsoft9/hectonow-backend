const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); 

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
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

module.exports = User;
