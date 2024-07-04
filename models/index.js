const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/connection");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model")(sequelize, DataTypes);
db.expenses = require("./expenses.model")(sequelize, DataTypes);
db.category = require("./category.model")(sequelize, DataTypes);
db.totalExpenses = require("./totalExpenses.model")(sequelize, DataTypes);

//user and expenses -> one to many relation..
db.user.hasMany(db.expenses, {
    foreignKey: "userId",
});
db.expenses.belongsTo(db.user, {
    foreignKey: "userId",
});

//expense and category -> one to many reation
db.category.hasMany(db.expenses, {
    foreignKey: "categoryId",
});
db.expenses.belongsTo(db.category, {
    foreignKey: "categoryId",
});

//one to many relation between totalExpenses and expenses
db.totalExpenses.hasOne(db.expenses, {
    foreignKey: "userId",
});
db.expenses.belongsTo(db.totalExpenses, {
    foreignKey: "userId",
});

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = {
    db,
    syncDatabase,
};
