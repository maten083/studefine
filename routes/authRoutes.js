//Ez a mappa tartalmazza az útvonalak kezeléséhez kapcsolódó fájlokat.(log in / sign up)
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup',authController.signup);
router.post('/login',authController.login);


module.exports = router;