const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authToken = require('../helpers/authToken');

router.get('/', groupController.listGroups);
router.get('/:id', groupController.getGroupById);

router.delete('/:id', authToken, groupController.deleteGroup);
router.post('/join', authToken, groupController.joinGroup);
router.post('/create', authToken, groupController.createGroup);


module.exports = router;
