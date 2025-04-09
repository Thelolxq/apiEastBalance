const { Sequelize} = require("sequelize");


DB_NAME = "EastBalance"
DB_PASSWORD = "sandia123.."
DB_USER = "root"
DB_HOST = "localhost"
DB_DIALECT = "mysql"
DB_PORT = 3306

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
});


module.exports = sequelize;