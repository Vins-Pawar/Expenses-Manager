const express = require("express");

const {
    createUser,
    loginUser,
    logoutUser,
    deleteFromSession
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/createuser", createUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);
router.post("/deletesession",deleteFromSession)

module.exports = router;
