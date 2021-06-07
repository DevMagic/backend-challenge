const postgre = require('pg-promise')();
const db = postgre({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database:process.env.DB_DATABASE
}) 

module.exports = db;