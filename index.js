const app = require("./app");
const { syncDatabase } = require("./models");


(async () => {
    await syncDatabase();

    const PORT = process.env.PORT || 8005;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();