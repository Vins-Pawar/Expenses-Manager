const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.MYSQL_DB_NAME,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql",
        // storage: "./database.sqlite", // Specify the path to the database file
        logging: false,
    }
);

try {
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
