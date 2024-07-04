const express = require("express");
const router = express.Router();

//routes
const userRoutes = require("./user.route");
const expensesRoutes = require("./expenses.route");


router.use("/user",userRoutes);
router.use("/expenses",expensesRoutes);

module.exports = router;
