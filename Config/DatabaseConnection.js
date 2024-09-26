const mysql = require('mysql2/promise');  
module.exports =  DataBaseConnection   = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'Vaishnavi',
        database: 'product_db',
        waitForConnections: true,
        connectionLimit: 10, // Optional: Adjust based on your needs
    });