const { DbManager } = require("./dbController");

// done
const createGroup = async (req, res) => {
    try {
        const groupData = req.body;

        if (groupData.name === "") {
            throw new Error("A csoport neve üres.");
        }

        const dbManager = new DbManager();

        if (!await dbManager.checkGroupName(groupData.name)) {
            throw new Error("Foglalt a csoport név.");
        }

        await dbManager.createGroup(req.user.id, groupData.name);

        res.status(201).json({ message: 'A csoport sikeresen létrejött.' });
    } catch(err){
        res.status(500).json({ error: err.message })
    }
};

const listGroups = async (req, res) => {
    try {
        const dbManager = new DbManager();
        const groupList = await dbManager.getAllGroups();
        return res.status(200).json(groupList);

    } catch (err){
        res.status(500).json({ error: err.message });
    }
};

// done
const getGroupById = async (req, res) => {
    try {
        const dbManager = new DbManager();

        const result = await dbManager.getGroupById(req.params.id);

        if (result.length === 0) {
            throw new Error("Nincs ilyen csoport.");
        }

        return res.status(200).json(result[0]);

    } catch (err){
        res.status(500).json({ error: err.message });
    }
}

// done
const joinGroup = async (req, res) => {
    try {

        const dbManager = new DbManager();
        if (!(await dbManager.joinGroup(req.user.id, req.body.id))) {
            throw new Error("Már csatlakoztál ehhez a csoporthoz.");
        }


        return res.status(200).json({ ...user, token: token });

    } catch (err){
        res.status(500).json({ error: err.message });
    }
};

// done,
const deleteGroup = async (req, res) => {
    try {
        const dbManager = new DbManager();

        if (!(await dbManager.deleteGroup(req.user.id, req.params.id))) {
            return res.status(403).json("Nem törölheted ezt a csoportot.");
        }

        return res.status(200).json("Csoport sikeresen törölve.");

    } catch (err){
        res.status(500).json({ error: err.message });
    }
};



// getUser() és createUser() --> userModel
module.exports = { createGroup, listGroups, getGroupById, joinGroup, deleteGroup }