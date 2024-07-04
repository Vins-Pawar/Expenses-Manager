module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define("Category", {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey : true,
        },
        categoryName: {
            type: DataTypes.STRING,
        },
        
    });
    return category;
};
