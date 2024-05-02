//Ez a mappa tartalmazza az útvonalak kezeléséhez kapcsolódó fájlokat.(log in / sign up)
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.post('/', topicController.createTopic);

module.exports = router;
