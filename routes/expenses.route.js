const express = require("express");

const auth = require("../middlewares/auth2");
const {
    createExpenses,
    getAllExpenses,
    getExpensesByCategory,
    getExpensesBetweenDate,
    updateExpenses,
    deleteExpenses,
} = require("../controllers/expenses.controller");

const router = express.Router();

router.post("/create-expenses", auth, createExpenses);
router.post("/update-expenses/:expenseId", auth, updateExpenses);
router.post("/delete-expenses/:expenseId", auth, deleteExpenses);
router.get("/get-all-expenses", auth, getAllExpenses);
router.get("/get-expenses-by-category", auth, getExpensesByCategory);
router.get("/get-expenses-between-dates", auth, getExpensesBetweenDate);

module.exports = router;
