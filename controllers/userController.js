// authController.js: Ez a mappa tartalmazza az útvonalakhoz kapcsolódó kontrollereket vagy vezérlőket.
// Ezek a fájlok felelősek az üzleti logika végrehajtásáért, például adatbázis műveletek végrehajtásáért, adatok kezeléséért stb.
const crypto = require('crypto');  //secret generálása a beépített könyvtárral
const jwt = require('jsonwebtoken');  //jwt token generálásához
const {DbManager} = require("./dbController");

const verifyToken = async (req, res) => {
    res.sendStatus(200);
}

// getUser() és createUser() --> userModel
module.exports = { verifyToken }