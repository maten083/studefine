const { DbManager } = require("./dbController");

const createPlainDefinition = async (req, res) => {
    try {
        const phraseId = req.params?.id;
        if (!phraseId) {
            throw new Error("hiányzik a phrase id");
        }

        const { definition } = req.body;
        if (!definition) {
            throw new Error("Hiányzik a definition");
        }

        const dbManager = new DbManager();

        //Ha nincs ilyen ID-val Phrase akkor error
        if (!(await dbManager.getPhrase(phraseId))) {
            throw new Error(`Nem létező phrase.${phraseId}`);
        }

        const activePlainDefinitionRelation =
            await dbManager.getPlainDefinitionByPhraseId(phraseId);
        const newPlainDefinition =
            await dbManager.createPlainDefinition(definition);

        if (activePlainDefinitionRelation) {
            const { plain_definition_id } = activePlainDefinitionRelation;
            await dbManager.addPlainDefToPlainDef(plain_definition_id,
                newPlainDefinition.id,
            );
            await dbManager.updatePlainDefinitionIdByPhraseId(
                phraseId,
                newPlainDefinition.id,
            );
        } else {
            await dbManager.addPlainDefinitionIntoPhrase(
                phraseId,
                newPlainDefinition.id,
            );
        }

        res.status(201).json(newPlainDefinition);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createPlainDefinition };
