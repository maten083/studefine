// authController.js: Ez a mappa tartalmazza az útvonalakhoz kapcsolódó kontrollereket vagy vezérlőket.
// Ezek a fájlok felelősek az üzleti logika végrehajtásáért, például adatbázis műveletek végrehajtásáért, adatok kezeléséért stb.
const userModel = require('../modell/userModel');
const crypto = require('crypto');


const signup = async (req, res) => {
    try{
        console.log(req.body);

        const userData = req.body;

        const hashedPassword = crypto.createHash('sha256').update(userData.password).digest('hex');
        await userModel.createUser( userData.username,userData.email, hashedPassword);
        res.status(201).json({message: 'A felhasználó sikeresen létrejött'});
    } catch(err){
        res.status(500).json({error: err.message})
    }
};

const login = async (req, res) => {
    try{
        const { email, password} = req.body;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await userModel.getUser(email,hashedPassword);
        if(!user){
            return res.status(400).json({message:'Érvénytelen email vagy jelszó'});
        }
        else{
            return res.json({message: 'Sikeres bejelentkezés'});
        }
    }catch (err){
        res.status(500).json({error: err.message });
    }
};


// getUser() és createUser() --> userModel
module.exports = {signup, login}