const express = require("express");
const router = express.Router();
const phraseController = require("../controllers/phraseController");

router.post("/:id", phraseController.createPhrase);

router.get("/:id", phraseController.getPhraseById);

router.put("/:id", phraseController.updatePhrase);

// TODO: phrase-ek mozgatása
module.exports = router;
