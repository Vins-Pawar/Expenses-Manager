const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();

require('dotenv').config()
 
const router = require("./routes/");
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const ONE_HOUR = 1000 * 60 *60;
 
const MySQLStore = require("express-mysql-session")(session);
const options = {
    host: "localhost",
    port: 3306,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    clearExpired: true,
    maxAge: ONE_HOUR,
     
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data : "data",
        },
    },
};
const sessionStore = new MySQLStore(options);

app.use(
    session({
        key: "session_Id",
        secret: process.env.SESSION_SECREATE,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: ONE_HOUR,
            sameSite: true,
        },
    })
);


app.use("/api", router);
 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

module.exports = app;
