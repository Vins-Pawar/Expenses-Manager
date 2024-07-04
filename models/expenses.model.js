const { toDefaultValue } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
    const expenses = sequelize.define("Expenses", {
        userId: {
            type: DataTypes.INTEGER,
        },
        categoryId: {
            type: DataTypes.INTEGER,
        },
        expenseAmount: {
            type: DataTypes.FLOAT,
        },
        expenseDescription: {
            type: DataTypes.STRING,
        },
        Date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

    });
    return expenses;
};
