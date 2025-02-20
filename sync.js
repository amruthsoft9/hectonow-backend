const sequelize = require("../config/database");

const Admin = require("./models/admin");


// Sync Database
sequelize.sync({ alter: true })
  .then(() => console.log("✅ All Models Synced"))
  .catch((err) => console.error("❌ Sync Error:", err));

module.exports = {Admin, Seller, Customer };
