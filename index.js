const express = require('express');
const app = express();
const port = 8080;

const cors = require('cors');
app.use(cors({origin:'http://localhost:3000'}))

app.get('/',(req, res)=>{
    res.send('Eme csodálatos szöveg egy GET endpoint');
});

app.use((req,res,next)=>{
    res.status(404).send("valami notGood");
});  

app.listen(port, ()=> {
    console.log(`A szerver elvileg fut itt--> http://localhost:${port}`)
});