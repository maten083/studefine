//Ez a mappa tartalmazza az útvonalak kezeléséhez kapcsolódó fájlokat.(log in / sign up)
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.post('/', topicController.createTopic);
router.post('/:id', topicController.createChildTopic);

router.put('/:id', topicController.updateTopic);

router.get('/:id', topicController.getTopicById);


// TODO: Egy userhez  tartozó topic és azon belüli topic-ok mozgatási lehetősége
module.exports = router;
