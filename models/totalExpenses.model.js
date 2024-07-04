module.exports = (sequelize, DataTypes) => {
    const totalExpenses = sequelize.define("TotalExpenses", {
        userId: {
            type: DataTypes.INTEGER,
           
        },
        totalExpenses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    return totalExpenses;
};
