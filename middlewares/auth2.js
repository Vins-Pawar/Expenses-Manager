const auth = async function (req, res, next) {
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(400).json({ Message: "Please Login..." });
    }
    next()
};

module.exports = auth;