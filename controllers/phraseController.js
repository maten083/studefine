const { DbManager } = require("./dbController");

//Phrase létrehozása
const createPhrase = async (req, res) => {
    const parentTopicId = req.params?.id;
    try {
        const phraseData = req.body;

        if (!parentTopicId) {
            throw new Error("Nincs ParentTopic");
        }
        // A leírás lehet üres, mivel később ez még módostható --> így létrejött egy üres topic
        if (!phraseData.name) {
            throw new Error("A phrase-nek nincs neve.");
        }

        const dbManager = new DbManager();

        //Ha nincs ilyen ID-val Topic akkor error
        if (!(await dbManager.getTopic(parentTopicId))) {
            throw new Error("Nem létező ParentTopic.");
        }

        // Új phrase létrehozása
        const newPhrase = await dbManager.createPhrase(
            phraseData.name,
            phraseData.definition,
        );
        // kapcsolótáblába szintén felvesszük az adatokat, hogy melyik topic-hoz tartozik az új phrase.
        await dbManager.addPhraseIntoTopic(parentTopicId, newPhrase.id);

        res.status(201).json(newPhrase);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPhraseById = async (req, res) => {
    console.log('req', req)
    try {
        const dbManager = new DbManager();
        const id = req.params.id;

        const phrase = await dbManager.getPhrase(id);

        if (!phrase) {
            return res.status(404).json({ error: "Nincs ilyen Phrase." });
        }

        res.status(200).json(phrase);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePhrase = async (req, res) => {
    try {
        const dbManager = new DbManager();
        const id = req.params.id;
        const { name, definition } = req.body;
        console.log("name:", name, definition, id);
        const updatedTopic = await dbManager.updatePhrase(name, definition, id);

        const existingPhrase = await dbManager.getPhrase(id);

        if (!existingPhrase) {
            return res.status(404).json({ error: "Nincs ilyen Phrase" });
        }


        res.status(200).json(updatedTopic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createPhrase, getPhraseById, updatePhrase };
