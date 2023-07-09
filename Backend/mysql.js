const mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'farida6789',
    database: 'trip_details'
    });
    // connect to database
    connection.connect();

module.exports = connection;