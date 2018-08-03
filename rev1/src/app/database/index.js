const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host    : process.env.DEVHOST,
    user    : process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
});

module.exports = db;