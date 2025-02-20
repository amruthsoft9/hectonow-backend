const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Admin = sequelize.define("Admin", {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: "id" },
  },
  permissions: {
    type: DataTypes.JSON, // Store admin-specific permissions
    allowNull: false,
    defaultValue: all,
  },
});

Admin.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Admin;
