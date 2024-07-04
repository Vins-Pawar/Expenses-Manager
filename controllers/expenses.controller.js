const { where, DATE } = require("sequelize");
const { Op } = require("sequelize");
const { db } = require("../models");
const asyncHandler = require("express-async-handler");
const sequelize = require("../db/connection");
const { raw } = require("express");
const { use } = require("../routes/expenses.route");

const createExpenses = asyncHandler(async (req, res) => {
    const userId = req.session?.userId;

    const { expenseAmount, expenseDescription, categoryId } = req.body;

    const t = await db.sequelize.transaction();

    try {
        const expense = await db.expenses.create(
            {
                userId: userId,
                expenseAmount: expenseAmount,
                expenseDescription: expenseDescription,
                categoryId: categoryId,
            },
            {
                transaction: t,
            }
        );

        const totalExpensesAmount = await db.totalExpenses.findOne({
            where: {
                userId: userId,
            },
        });

        totalExpensesAmount.totalExpenses += Number(expense.expenseAmount);

        await totalExpensesAmount.save({
            transaction: t,
        });
        await t.commit();
        return res.status(200).json({ data: expense });
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
});

const getAllExpenses = asyncHandler(async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(400).json({ Message: "Please Login..." });
    }

    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const allExpenses = await db.expenses.findAll({
        where: {
            userId: userId,
        },
        offset: (page - 1) * limit,
        limit: limit,
        order: [[db.sequelize.col("Date"), "DESC"]],
        include: [db.category],
    });

    const totalExpenses = await db.totalExpenses.findOne({
        where: {
            userId: userId,
        },
    });

    const query = `select sum(expenseAmount) as totalAmount from expenses where userId=${userId} group by userId`;
    const [result, metaData] = await db.sequelize.query(query);

    return res.status(200).json({
        Message: "sucessful",
        data: allExpenses,
        totalAmount: totalExpenses.totalExpenses,
    });
});

const getExpensesByCategory = asyncHandler(async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(400).json({ Message: "Please Login..." });
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const categoryId = Number(req.query.categoryId);

    const allExpenses = await db.expenses.findAll({
        where: {
            userId: userId,
            categoryId: categoryId,
        },
        include: [db.category, db.totalExpenses],
        offset: (page - 1) * limit,
        limit: limit,
        order: [["Date", "DESC"]],
    });

    const totalAmount = await db.expenses.sum("expenseAmount", {
        where: {
            userId: userId,
            categoryId: categoryId,
        },
    });

    return res.status(200).json({
        Message: "sucessful",
        data: allExpenses,
        totalAmount: totalAmount,
    });
});

const getExpenseById = asyncHandler(async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(400).json({ Message: "Please Login..." });
    }

    const expense = await db.expenses.findOne({
        where: {
            id: expenseId,
        },
        include: [db.category, db.totalExpenses],
    });
    return res.status(200).json({ data: expense });
});

const getExpensesBetweenDate = asyncHandler(async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(400).json({ Message: "Please Login..." });
    }
    if (!req.query.startDate || !req.query.endDate) {
        return res.status(400).json({ Message: "Both dates are required..." });
    }

    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (startDate > endDate) {
        return res
            .status(400)
            .json({ Message: "Start date should be less than end date" });
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const result = await db.expenses.findAll({
        where: {
            userId: userId,
            Date: {
                [Op.gte]: formattedStartDate,
                [Op.lte]: formattedEndDate,
            },
            include: [db.category, db.totalExpenses],
        },
    });
    const totalAmount = await db.expenses.sum("expenseAmount", {
        where: {
            userId: userId,
            Date: {
                [Op.gte]: formattedStartDate,
                [Op.lte]: formattedEndDate,
            },
        },
    });

    return res.status(200).json({ expenses: result, totalAmount: totalAmount });
});

const updateExpenses = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const expenseId = Number(req.params?.expenseId);

    if (!expenseId) {
        return res.status(400).json({ Message: "Expense id is required.." });
    }

    const { expenseAmount, expenseDescription, categoryId } = req.body;

    const t = await db.sequelize.transaction();
    try {
        const expenses = await db.expenses.findOne({
            where: {
                id: expenseId,
            },
        });

        const totalExpensesAmout = await db.totalExpenses.findOne({
            where: {
                userId: userId,
            },
        });

        if (!expenses) {
            return res.status(400).json({ Message: "Wrong Expense ID" });
        }

        if (Number(expenseAmount)) {
            totalExpensesAmout.totalExpenses =
                totalExpensesAmout.totalExpenses -
                expenses.expenseAmount +
                Number(expenseAmount);
            expenses.expenseAmount = Number(expenseAmount);
        }

        if (expenseDescription) {
            expenses.expenseDescription = expenseDescription;
        }

        if (categoryId) {
            expenses.categoryId = categoryId;
        }

        await expenses.save({ transaction: t });
        await totalExpensesAmout.save({ transaction: t });
        // throw new Error("Hello");
        await t.commit();
        return res.status(400).json({
            expenses: expenses,
            totalExpensesAmout: totalExpensesAmout,
        });
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
});

const deleteExpenses = asyncHandler(async (req, res) => {
    const userId = req.session?.userId;
    const expenseId = Number(req.params?.expenseId);
    console.log(expenseId);
    if (!expenseId) {
        return res.status(400).json({ Message: "expese id is required..." });
    }
    const expense = await db.expenses.findOne({
        where: {
            id: expenseId,
        },
    });
    if (!expense) {
        return res.status(400).json({ Message: "expense not found..." });
    }

    const totalExpenses = await db.totalExpenses.findOne({
        where: {
            userId: userId,
        },
    });
    const t = await db.sequelize.transaction();

    try {
        totalExpenses.totalExpenses -= expense.expenseAmount;
        await expense.destroy({ transaction: t });
        await totalExpenses.save({ transaction: t });
        await t.commit();

        return res
            .status(200)
            .json({ Message: `${expenseId} sucessfully deleted...` });
    } catch (error) {
        await t.rollback();
        new Error(error);
    }
});

module.exports = {
    createExpenses,
    getAllExpenses,
    getExpensesByCategory,
    getExpenseById,
    getExpensesBetweenDate,
    updateExpenses,
    deleteExpenses,
};
