const {sequelize, DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const Admin = sequelize.define('admin', {
    id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fullName: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    email: {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false
    },
}, {
    timeStamps:true,

});
module.exports = Admin;
