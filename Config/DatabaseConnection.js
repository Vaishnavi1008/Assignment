const mysql = require('mysql2/promise');  
module.exports =  DataBaseConnection   = mysql.createPool({
        host: process.env.DB_HOST,//'localhost',
        user: process.env.DB_USER,//'root',
        password:process.env.DB_PASSWORD, //'Vaishnavi',
        database:process.env.DB_NAME,// 'product_db',
        waitForConnections: true,
        connectionLimit: 10, // Optional: Adjust based on your needs
    });