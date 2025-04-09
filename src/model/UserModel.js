const sequelize = require("../db/Db.js");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
    'User',
    {
        Username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        Password:{
            type: DataTypes.STRING,
            allowNull: false,
        } 
    },{
        tableName: "users"
    });

module.exports = User
