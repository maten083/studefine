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
const phraseRoutes = require('./routes/phraseRoutes');
const plainDefinitionRoutes = require('./routes/plainDefinitionRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//test endpoint
app.get('/',(req, res)=>{
    res.send('GET endpoint - welcome');
});

//Elérési útvonalak megadása a HOST-on / modul meghívva a fő fájlban
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/topics',topicRoutes);
app.use('/phrases',phraseRoutes);
app.use('/plainDefinition',plainDefinitionRoutes);

app.listen(port, ()=> {
    console.log(`A szerver itt fut--> http://localhost:${port}`)
});

app.use((req,res)=>{
    res.status(404).send("valami nem jó - 404");
});
