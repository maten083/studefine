//Ez a mappa tartalmazza az útvonalak kezeléséhez kapcsolódó fájlokat.(log in / sign up)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authToken = require('../helpers/authToken')

router.get('/verifyToken', authToken, userController.verifyToken);

module.exports = router;