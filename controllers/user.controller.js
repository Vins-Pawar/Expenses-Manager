const { where } = require("sequelize");
const { db } = require("../models");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const { LIMIT_FUNCTION_ARG } = require("sqlite3");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const pool = mysql.createPool({
    host: "localhost",
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
});

const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const User = db.user;
    const exisingUser = await User.findAll({
        where: {
            email: email,
        },
    });

    if (exisingUser && exisingUser.lenght == 0) {
        return res.status(400).json({ Message: "User is already registed..." });
    }
    const hashPasword = await bcrypt.hash(
        password,
        10
    );
    const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPasword,
    });

    await db.totalExpenses.create({
        userId: newUser.userId,
    });

    req.session.userId = newUser.userId;
    return res.status(200).json({ Message: "User is sucessfully created..." });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
        return res.status(400).json({ Message: "All fileds are required...!" });
    }

    const user = await db.user.findOne({
        where: {
            email: email,
        },
    });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ Message: "Wrong eamil or password...." });
    }

    if (!user) {
        return res
            .status(400)
            .json({ Message: "No User found Please check ur credentials..." });
    }

    req.session.userId = user.userId;

    return res
        .status(200)
        .json({ data: user, Message: "User sucessfully login" });
});

const logoutUser = asyncHandler((req, res) => {
    req.session.destroy((err) => {
        console.log(err);
        if (er) ret;
        res.clearCookie("session_id");
    });
    return res.status(200).json({ Message: "logout Sucessful" });
});

const deleteFromSession = asyncHandler(async (req, res) => {
    const userId = 1000;
    try {
        const [result] = await pool.execute(
            'DELETE FROM sessions WHERE JSON_EXTRACT(data, "$.userId") = ?',
            [userId]
        );
        console.log(
            `Deleted ${result.affectedRows} session(s) for userId: ${userId}`
        );
        return res.status(200).json({
            Message: `Deleted ${result.affectedRows} session for userId: ${userId}`,
        });
    } catch (error) {
        console.error("Error deleting sessions:", error);
        throw error;
    }
});
module.exports = { createUser, loginUser, logoutUser, deleteFromSession };
