const express = require("express");
const router = express.Router();
const plainDefinitionController = require("../controllers/plainDefinitionController");

router.post("/:id", plainDefinitionController.createPlainDefinition);
//todo activate plain definition
module.exports = router;
