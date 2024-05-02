const { DbManager } = require("./dbController");
const {JwtHelper} = require("../helpers/jwtHelper");

//Topic létrehozása


const createTopic = async (req, res) => {

    try {
        const topicData = req.body;
        const userByToken = await JwtHelper.getUserdataFromHeader(req);
        console.log('result: ',userByToken, 'headers: ', req.headers);

        // A leírás lehet üres, mivel később ez még módostható --> így létrejött egy üres topic
        if (!topicData.name|| !userByToken.id) {
            throw new Error("Valamelyik mező üres.");
        }


        const dbManager = new DbManager();

        //Ha nincs ilyen ID-val user akkor error
        if (!await dbManager.getUserById(userByToken.id)) {
            throw new Error("Nem létező felhasználó.");
        }

        // Új topic létrehozása
        const newTopic = await  dbManager.createTopic(topicData.name, topicData.definition);
        // kapcsolótáblába szintén felvesszük az adatokat, hogy kihez tartozik.
        await dbManager.createUserTopic(userByToken.id,newTopic.id);


        res.status(201).json({ message: `Az ID:${newTopic.id} , ${newTopic.name} topic sikeresen létrejött.` });
    } catch(err){
        res.status(500).json({ error: err.message })
    }
};

module.exports = {createTopic}