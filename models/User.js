const {sequelize, DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');

const user = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName : {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    password: {
        type:DataTypes.STRING,
        allowNull: false

    },
    role: {
        type: DataTypes.ENUM("user","seller","admin"),
        defaultvalue: "user"
    }
},{
    timestamps: true,
});
module.exports= user;