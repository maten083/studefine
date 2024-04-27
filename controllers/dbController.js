const { Pool } = require('pg');

// Adatbázishoz való csatlakozás

// test data
//pool.query(`INSERT INTO users (firstname, lastname, age) VALUES ('f_name ', 'l_name', 69);`);

// #: private változó az osztálynak
class DbManager {
    /** @type{Pool} */
    #pool;

    /** @type{Boolean} */
    #initialized = false;

    /** @type{function[]} */
    #queue = [];

    constructor() {
        //A psql alapértelmezett adatbázisa van megadva

        this.#pool = new Pool({
            user: process.env.PSQL_USERNAME + '',
            host: process.env.PSQL_IP + '',
            database: process.env.PSQL_DB + '',
            password: process.env.PSQL_PASSWORD + '',
            port: Number(process.env.PSQL_PORT + ''),
        });

        this.#init();
    }

    async #init() {
        if (this.#initialized) return;

        try {
            await this.#pool.connect();
        }
        catch (e) {
            console.error(`Nem sikerült csatlakozni az adatbázishoz`);
            console.error(e);
        }

        // Initialized jelző true-ra rakása, és az összes nem lefutott metódus futtatása

        this.#initialized = true;
        for (const fn of this.#queue) {
            fn();
        }

        // Tömb elemeinek törlése
        this.#queue.length = 0;
    }

    async verifyTables() {
        // Ha a pool nem csatlakozott, akkor belerakjuk a queue-be a parancs meghívását
        if (!this.#initialized) {
            this.#queue.push(this.verifyTables.bind(this));
            return;
        }

        try {
            let createTableQuery = `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(256) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`;
            await this.#pool.query(createTableQuery);
            console.log('Felhasználók tábla létrehozva');

            createTableQuery = `CREATE TABLE IF NOT EXISTS groups (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            )`;
            await this.#pool.query(createTableQuery);
            console.log('Group tábla létrehozása');

            createTableQuery = `CREATE TABLE IF NOT EXISTS membership (
                user_id SERIAL REFERENCES users(id),
                group_id SERIAL REFERENCES groups(id)
            )`;
            await this.#pool.query(createTableQuery);
            console.log('Membership kapcsolat tábla létrehozása');
        } catch (error) {
            console.error('Hiba történt a tábla létrehozása során', error);
        }
    }

    /**
     * Ellenőrzi, hogy szabad-e a jelenlegi felhasználónév
     * @param {string} username a felhasználónév
     * @returns {Promise<boolean>} true ha szabad a felhasználónév, false ha már foglalt
     */
    async checkUsername(username) {
        const query = 'SELECT id FROM users WHERE username = $1';
        const result = await this.query(query, [username]);

        return result.rows.length === 0;
    }

    /**
     * Ellenőrzi, hogy szabad-e a megadott e-mail cím
     * @param {string} email az e-mail cím
     * @returns {Promise<boolean>} true ha szabad az e-mail cím, false ha már foglalt
     */
    async checkEmail(email) {
        const query = 'SELECT id FROM users WHERE email = $1';
        const result = await this.query(query, [email]);

        return result.rows.length === 0;
    }

    // User műveletek
    async createUser(username, email, password) {
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
        await this.query(query, [username, email, password]);
    }

    async getUser(email, password) {
        const query = 'SELECT id, username, email FROM users WHERE email = $1 AND password = $2';
        const result = await this.query(query, [email, password]);
        return result.rows[0];
    };

    /**
     * Queries the database
     * @param {string} query
     * @param {array} params
     * @returns {Promise<void>}
     */
    query(query, params = []) {
        return new Promise(async (resolve, reject) => {
            if (!this.#initialized) {
                // Belerakjuk a queue-be a jelenlegi query hívást
                this.#queue.push(this.#queryInternal.bind(this, query, params, resolve, reject));
                return;
            }

            await this.#queryInternal(query, params, resolve, reject);
        });
    }

    async #queryInternal(query, params, resolve, reject) {
        try {
            const response = await this.#pool.query(query, params);
            resolve(response);
        } catch (e) {
            reject(e);
        }
    }
}

const instance = new DbManager();
instance.verifyTables();


// Az adatbázis lekérdez

/*
pool.query(`SELECT * FROM users`,(err,res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    pool.end;
});
*/
module.exports = {DbManager};

