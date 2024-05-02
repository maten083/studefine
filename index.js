const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const port = 8080;

dotenv.config({
    path: './secret.env'
});

const cors = require('cors');
app.use(cors({origin:'http://localhost:3000'}))

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//test endpoint
app.get('/',(req, res)=>{
    res.send('Eme csodálatos szöveg egy GET endpoint');
});

app.use('/auth', authRoutes); //Elérési útvonalak megadása a HOST-on / modul meghívva a fő fájlban
app.use('/user', userRoutes);
app.use('/topics',topicRoutes);

app.listen(port, ()=> {
    console.log(`A szerver elvileg fut itt--> http://localhost:${port}`)
});

app.use((req,res)=>{
    res.status(404).send("valami notGood");
});
