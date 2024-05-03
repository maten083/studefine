const { Pool } = require("pg");

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
            user: process.env.PSQL_USERNAME + "",
            host: process.env.PSQL_IP + "",
            database: process.env.PSQL_DB + "",
            password: process.env.PSQL_PASSWORD + "",
            port: Number(process.env.PSQL_PORT + ""),
        });

        this.#init();
    }

    async #init() {
        if (this.#initialized) return;

        try {
            await this.#pool.connect();
        } catch (e) {
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

            // USERS =================================================
            let createTableQuery = `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(256) UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`;
            await this.#pool.query(createTableQuery);
            console.log("users tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS groups (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            )`;
            await this.#pool.query(createTableQuery);
            console.log("groups tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS membership (
                user_id SERIAL REFERENCES users(id),
                group_id SERIAL REFERENCES groups(id)
            )`;
            await this.#pool.query(createTableQuery);
            console.log("membership kapcsolat tábla létrehozva");

            // TOPICS =================================================
            createTableQuery = `CREATE TABLE IF NOT EXISTS topics (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                definition TEXT
            )`;
            await this.#pool.query(createTableQuery);
            console.log("topics tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS user_topic (
                user_id SERIAL REFERENCES users(id),
                topic_id SERIAL REFERENCES topics(id)
            )`;
            await this.#pool.query(createTableQuery);
            console.log("user_topic kapcsolat tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS topic_relation (
                parent_id SERIAL REFERENCES topics(id),
                child_id SERIAL REFERENCES topics(id)
            )`;
            await this.#pool.query(createTableQuery);
            console.log("topic_relation kapcsolat tábla létrehozva");

            // PHRASES =================================================
            createTableQuery = `CREATE TABLE IF NOT EXISTS phrases (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(100) NOT NULL,
                  definition TEXT
              )`;
            await this.#pool.query(createTableQuery);
            console.log("phrases tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS plain_definition (
                id SERIAL PRIMARY KEY,
                definition TEXT
            )`;
            await this.#pool.query(createTableQuery);
            console.log("plain_definition tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS plain_definitions_relation (
                parent_plain_definition_id SERIAL REFERENCES plain_definition(id),
                child_plain_definition_id SERIAL REFERENCES plain_definition(id),
                UNIQUE (child_plain_definition_id)
            );`;
            await this.#pool.query(createTableQuery);
            console.log("plain_definitions_relation kapcsolat tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS topic_phrases_relation (
                parent_topic_id SERIAL REFERENCES topics(id),
                phrase_id SERIAL REFERENCES phrases(id),
                UNIQUE (phrase_id)
            )`;
            await this.#pool.query(createTableQuery);
            console.log("topic_phrase_relation kapcsolat tábla létrehozva");

            createTableQuery = `CREATE TABLE IF NOT EXISTS phrase_plain_definition_relation (
                phrase_id SERIAL REFERENCES phrases(id),
                plain_definition_id SERIAL REFERENCES plain_definition(id),
                UNIQUE (phrase_id),
                UNIQUE (plain_definition_id)
            )`;
            await this.#pool.query(createTableQuery);
            console.log(
                "phrase_plain_definition_relation kapcsolat tábla létrehozva",
            );
        } catch (error) {
            console.error("Hiba történt a tábla létrehozása során", error);
        }
    }

    /**
     * Ellenőrzi, hogy szabad-e a jelenlegi felhasználónév
     * @param {string} username a felhasználónév
     * @returns {Promise<boolean>} true ha szabad a felhasználónév, false ha már foglalt
     */
    async checkUsername(username) {
        const query = "SELECT id FROM users WHERE username = $1";
        const result = await this.query(query, [username]);

        return result.rows.length === 0;
    }

    /**
     * Ellenőrzi, hogy szabad-e a megadott e-mail cím
     * @param {string} email az e-mail cím
     * @returns {Promise<boolean>} true ha szabad az e-mail cím, false ha már foglalt
     */
    async checkEmail(email) {
        const query = "SELECT id FROM users WHERE email = $1";
        const result = await this.query(query, [email]);

        return result.rows.length === 0;
    }

    // User műveletek
    async createUser(username, email, password) {
        const query =
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
        await this.query(query, [username, email, password]);
    }

    async getUser(email, password) {
        const query =
            "SELECT id, username, email FROM users WHERE email = $1 AND password = $2";
        const result = await this.query(query, [email, password]);
        return result.rows[0];
    }

    async getUserById(id) {
        const query = "SELECT * FROM users WHERE id = $1";
        const result = await this.query(query, [id]);
        return result.rows[0];
    }

    //Topic műveletek

    async createTopic(name, definition) {
        const query =
            "INSERT INTO topics(name, definition) VALUES ($1, $2) RETURNING * ";
        const result = await this.query(query, [name, definition]);
        return result.rows[0];
    }

    //Kapcsolótábla adatainak beszúrása
    async createUserTopic(user_id, topic_id) {
        const query = "INSERT INTO user_topic(user_id, topic_id) VALUES ($1, $2)";
        const result = await this.query(query, [user_id, topic_id]);
        return result.rows[0];
    }

    async createTopicRelation(parent_id, child_id) {
        const query =
            "INSERT INTO topic_relation(parent_id, child_id) VALUES ($1, $2)";
        const result = await this.query(query, [parent_id, child_id]);
        return result.rows[0];
    }

    async getTopic(id) {
        const query = "SELECT * FROM topics WHERE id = $1";
        const result = await this.query(query, [id]);
        return result.rows[0];
    }

    async updateTopic(newName, newDefinition, id) {
        const query =
            "UPDATE topics SET name = $1 , definition  = $2 WHERE id = $3 RETURNING *";
        const result = await this.query(query, [newName, newDefinition, id]);
        return result.rows[0];
    }

    //phrases műveletek
    async createPhrase(name, definition) {
        const query =
            "INSERT INTO phrases(name, definition) VALUES ($1, $2) RETURNING * ";
        const result = await this.query(query, [name, definition]);
        return result.rows[0];
    }

    async updatePhrase(newName, newDefinition, id) {
        const query =
            "UPDATE phrases SET name = $1 , definition  = $2 WHERE id = $3 RETURNING *";
        const result = await this.query(query, [newName, newDefinition, id]);
        return result.rows[0];
    }

    async addPhraseIntoTopic(parentTopicId, phrase_id) {
        const query =
            "INSERT INTO topic_phrases_relation(parent_topic_id, phrase_id) VALUES ($1, $2)";
        const result = await this.query(query, [parentTopicId, phrase_id]);
        return result.rows[0];
    }

    async getPhrase(id) {
        const query = `SELECT * FROM phrases WHERE phrases.id = $1;`;
        const result = await this.query(query, [id]);
        return result.rows[0];
    }

    async createPlainDefinition(definition) {
        const query =
            "INSERT INTO plain_definition(definition) VALUES ($1) RETURNING *";
        const result = await this.query(query, [definition]);
        return result.rows[0];
    }

    async addPlainDefinitionIntoPhrase(phraseId, newPlainDefinitionId) {
        const query =
            "INSERT INTO phrase_plain_definition_relation(phrase_id, plain_definition_id) VALUES ($1, $2)";
        const result = await this.query(query, [phraseId, newPlainDefinitionId]);
        return result.rows[0];
    }

    // aktuális kijelölése ezzel a függvényhez
    async updatePlainDefinitionIdByPhraseId(phraseId, newPlainDefinitionId) {
        const query = `UPDATE phrase_plain_definition_relation SET plain_definition_id = $2 WHERE phrase_id = $1`;
        const result = await this.query(query, [phraseId, newPlainDefinitionId]);
        return result.rows[0];
    }

    async addPlainDefToPlainDef(
        parent_plain_definition_id,
        child_plain_definition_id,
    ) {
        const query = `INSERT INTO plain_definitions_relation(parent_plain_definition_id, child_plain_definition_id) VALUES ($1, $2)`;
        const result = await this.query(query, [
            parent_plain_definition_id,
            child_plain_definition_id,
        ]);
        return result.rows[0];
    }

    async getPlainDefinitionByPhraseId(phraseId) {
        const query =
            "SELECT * FROM phrase_plain_definition_relation where phrase_id = $1";
        const result = await this.query(query, [phraseId]);
        return result.rows[0];
    }

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
                this.#queue.push(
                    this.#queryInternal.bind(this, query, params, resolve, reject),
                );
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



topics
id, name, definition
userTopics
user_id REF users (id), topic_id ref topics (id)
*/
module.exports = { DbManager };
