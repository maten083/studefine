// authController.js: Ez a mappa tartalmazza az útvonalakhoz kapcsolódó kontrollereket vagy vezérlőket.
// Ezek a fájlok felelősek az üzleti logika végrehajtásáért, például adatbázis műveletek végrehajtásáért, adatok kezeléséért stb.
const userModel = require('../modell/userModel');
const crypto = require('crypto');  //secret generálása a beépített könyvtárral
const jwt = require('jsonwebtoken');  //jwt token generálásához
const dotenv = require('dotenv'); //.env file-ban fogjuk tárolni a tokent

// require('crypto').randomBytes(64).toString('hex')//token generálása

// get config vars
dotenv.config();

function generateAccessToken(email) {
    return jwt.sign(email, process.env.TOKEN_SECRET,);
}

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
        //const user = await userModel.getUser(email,hashedPassword);
        const user = await  userModel.getUserByEmail(email);

        if(!user){
            return res.status(400).json({message:'Érvénytelen email'});
        }
        if(user.password !== hashedPassword){
            return res.status(400).json({message:'Érvénytelen jelszó'});
        }
        // Ha sikerült bejelentkezni
        else{

            //Ha nincs token akkor lesz
            let token = user.token
            if (!token){
                token = require('crypto').randomBytes(64).toString('hex') //token generálása
                await userModel.updateToken(token,email);
            }

            //Visszaadjuk a teljes usert (...user) és a token-t (token:token) megváltoztatjuk az új tokenre (ha kell) ÉS visszaadjuk azt is
            return res.json({...user,token:token});
        }
    }catch (err){
        res.status(500).json({error: err.message });
    }
};


// getUser() és createUser() --> userModel
module.exports = {signup, login}