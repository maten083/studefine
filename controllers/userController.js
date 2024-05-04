const {DbManager} = require("./dbController");

const verifyToken = async (req, res) => {
    res.sendStatus(200);
}

// A felhasználó csoportjainak lekérése
const getGroups = async(req, res) => {
    try {
        const dbManager = new DbManager();

        const groups = await dbManager.getUserGroups(req.user.groups);
        res.status(200).json(groups);

    } catch (err){
        res.status(500).json({ error: err.message });
    }
}

// getUser() és createUser() --> userModel
module.exports = { verifyToken, getGroups }