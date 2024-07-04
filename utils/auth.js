const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const { where } = require("sequelize");

const setUser = function (userId) {
    const token = uuidv4();
    console.log(token);

    res.cookie("token", token);
    req.session.token = user.userId;
};

const getUser = async function (token) {
     
    const useID = token;
    const user = await db.user.find({
        where: {
            userId: useID,
        },
    });

    if (!user) {
        return null;
    }
    return user;
};

module.exports = { setUser, getUser };
