require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: true
        },
        multipleStatements: true
    });

    console.log('Connected to TiDB Cloud!');

    const sqlPath = path.join(__dirname, 'setup.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Remove database creation/switch if we are using the 'test' database as provided
    // This ensures we don't try to create a new DB if the user doesn't have permissions
    sql = sql.replace(/CREATE DATABASE IF NOT EXISTS secure_ecom;/g, '-- CREATE DATABASE IF NOT EXISTS secure_ecom;');
    sql = sql.replace(/USE secure_ecom;/g, '-- USE secure_ecom;');

    try {
        console.log('Initializing tables...');
        await connection.query(sql);
        console.log('Database initialized successfully!');
    } catch (err) {
        console.error('Error initializing database:', err.message);
    } finally {
        await connection.end();
    }
}

initDB();
