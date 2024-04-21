
const {pool} = require('../db/db');



const createUser = async (username, email, password) => {
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
    await pool.query(query, [username, email, password]);
};

const getUser = async (email, password) => {
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email, password]);
    return result.rows[0];
};

//token lekéréséhez egyedi cím alapján kérjük vissza a usert
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

const updateToken = async (token,email) => {
    const query = 'UPDATE users SET token = $1 WHERE email = $2' ;
    await pool.query(query, [token,email]);
}


module.exports = { createUser, getUser,getUserByEmail,updateToken, pool};