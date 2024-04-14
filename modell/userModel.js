
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

module.exports = { createUser, getUser, pool};