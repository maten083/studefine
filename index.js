const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

const cors = require('cors');
app.use(cors({origin:'http://localhost:3000'}))

const authRouth = require('./routes/authRoutes');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


//test endpoint
app.get('/',(req, res)=>{
    res.send('Eme csodálatos szöveg egy GET endpoint');
});



app.use('/auth', authRouth) //Elérési útvonalak megadása a HOST-on / modul meghívva a fő fájlban

app.listen(port, ()=> {
    console.log(`A szerver elvileg fut itt--> http://localhost:${port}`)
});

app.use((req,res,next)=>{
    res.status(404).send("valami notGood");
});
