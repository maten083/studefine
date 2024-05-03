const { DbManager } = require("./dbController");
const {JwtHelper} = require("../helpers/jwtHelper");

//Topic létrehozása


const createTopic = async (req, res) => {
    try {
        const topicData = req.body;
        const userByToken = await JwtHelper.getUserdataFromHeader(req);
        console.log('result: ', userByToken, 'headers: ', req.headers);

        // A leírás lehet üres, mivel később ez még módostható --> így létrejött egy üres topic
        if (!topicData.name || !userByToken.id) {
            throw new Error("Valamelyik mező üres.");
        }


        const dbManager = new DbManager();

        //Ha nincs ilyen ID-val user akkor error
        if (!await dbManager.getUserById(userByToken.id)) {
            throw new Error("Nem létező felhasználó.");
        }

        // Új topic létrehozása
        const newTopic = await dbManager.createTopic(topicData.name, topicData.definition);
        // kapcsolótáblába szintén felvesszük az adatokat, hogy kihez tartozik.
        await dbManager.createUserTopic(userByToken.id, newTopic.id);


        res.status(201).json({message: `Az ID:${newTopic.id} , ${newTopic.name} topic sikeresen létrejött.`});
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

const createChildTopic = async (req, res) => {
    const parentTopicId = req.params?.id // Ha létezik parentTopic
    try {
        const topicData = req.body;


        // A leírás lehet üres, mivel később ez még módostható --> így létrejött egy üres topic
        if (!topicData.name ) {
            throw new Error("A topicnak nincs neve.");
        }

        const dbManager = new DbManager();

        //Ha nincs ilyen ID-val Topic akkor error
        if (!await dbManager.getTopic(parentTopicId)) {
            throw new Error("Nem létező Topics.");
        }

        // Új topic létrehozása
        const newTopic = await dbManager.createTopic(topicData.name, topicData.definition);
        // kapcsolótáblába szintén felvesszük az adatokat, hogy kihez tartozik.
        await dbManager.createTopicRelation(parentTopicId, newTopic.id);


        res.status(201).json({message: `Az ID:${newTopic.id} , ${newTopic.name} topic sikeresen létrejött.`});
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const getTopicById = async (req, res) => {
    try {

        const dbManager = new DbManager();
        const topic = await dbManager.getTopic(req.params?.id);

        if (!topic){
            res.status(404).json({error: "Nem létezik ilyen topic"})
        }
        else {
            res.status(200).json(topic);
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

const updateTopic = async (req, res) => {
    try {

        const dbManager = new DbManager();
        const id = req.params.id
        const {name,definition} = req.body
        console.log("name:", name, definition, id)
        const updatedTopic = await dbManager.updateTopic(name,definition,id);

        const existingTopic = await dbManager.getUserById(id);
        if (!existingTopic){
            res.status(404).json({error: "Nem létezik ilyen topic"})
        }
        else{
            res.status(200).json(updatedTopic);
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

module.exports = {createTopic, createChildTopic, getTopicById, updateTopic}