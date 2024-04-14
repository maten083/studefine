const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'usertest',
    password: 'asdf',
    port: 5432,
});

// Adatbázishoz való csatlakozás
pool.connect();

// ez műkszik
//pool.query(`INSERT INTO users (firstname, lastname, age) VALUES ('nyomorult', 'fos', 69);`);

//a tábla létrehozása
(async () => {
    try {
        const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`;
        await pool.query(createTableQuery);
        console.log('Felhasználók tábla létrehozva adatokkal');
    } catch (error) {
        console.error('Hiba történt a tábla létrehozása során', error);
    }
})();


// Az adatbázis lekérdez
pool.query(`SELECT * FROM users`,(err,res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    pool.end;
});

module.exports = {pool};

