const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Seller = sequelize.define("Seller", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  shopName: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Seller;
