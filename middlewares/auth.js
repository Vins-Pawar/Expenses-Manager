//this code is not used in project...
const { loginUser } = require("../controllers/user.controller");
const { db } = require("../models/index");

const verifyToken = async function (req, res, next) {
    let token = req.cookies?.session_Id;
    
    if (!token) {
        return res.status(400).json({ Message: "Please Login...!" });
    }
    token = token.split(".")[0].substring(2);

    const query = `select * from sessions where session_id = ?`;
    const [result, metaData] = await db.sequelize.query(query, {
        replacements: [token],
    });
     
    if (result.length === 0) {
        return res.status(400).json({ Message: "Please Login...!" });
    }
    const sessionData = JSON.parse(result[0].data);

    const userId = sessionData.userId;
    const user = await db.user.findOne({
        where: {
            userId: userId,
        },
    });

    if (!user) {
        return res.status(400).json({ Message: "Please Login...!" });
    }
    req.user = user;
    next();
};

module.exports = { verifyToken };
