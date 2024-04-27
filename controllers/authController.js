// authController.js: Ez a mappa tartalmazza az útvonalakhoz kapcsolódó kontrollereket vagy vezérlőket.
// Ezek a fájlok felelősek az üzleti logika végrehajtásáért, például adatbázis műveletek végrehajtásáért, adatok kezeléséért stb.
const crypto = require('crypto');  //secret generálása a beépített könyvtárral
const { DbManager } = require("./dbController");
const { JwtHelper } = require("../helpers/jwtHelper"); //.env file-ban fogjuk tárolni a tokent

const signup = async (req, res) => {
    try {
        const userData = req.body;

        if (userData.username === "" || userData.email === "" || userData.password === "") {
            throw new Error("Valamelyik mező üres.");
        }

        // TODO: Később fejleszteni, ha az alkalmazás további fejlesztése szükséges
        if (!userData.email.includes('@')) {
            throw new Error("Hibás email.");
        }

        const dbManager = new DbManager();

        if (!await dbManager.checkUsername(userData.username)) {
            throw new Error("Foglalt felhasználónév.");
        }

        if (!await dbManager.checkEmail(userData.email)) {
            throw new Error("Foglalt email.");
        }

        const hashedPassword = crypto.createHash('sha256').update(userData.password).digest('hex');
        await dbManager.createUser(userData.username, userData.email, hashedPassword);

        res.status(201).json({ message: 'A felhasználó sikeresen létrejött.' });
    } catch(err){
        res.status(500).json({ error: err.message })
    }
};

const login = async (req, res) => {
    try {
        // email és jelszó alapján ellenőrizzük a felhasználót
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Adatbázis kezelő létrehozása és fiók lekérése
        const dbManager = new DbManager();
        const user = await dbManager.getUser(email, hashedPassword)

        // Ha nincs ilyen fiók email + password-del, akkor visszaadjuk, hogy nincs
        if (!user) {
            return res.status(400).json({ message: 'Érvénytelen email vagy jelszó' });
        }

        // Token generálása
        const token = JwtHelper.generateToken(user);

        // Visszaadjuk a teljes usert (...user) és a token-t (token:token)
        return res.status(200).json({ ...user, token: token });

    } catch (err){
        res.status(500).json({ error: err.message });
    }
};


// getUser() és createUser() --> userModel
module.exports = { signup, login }