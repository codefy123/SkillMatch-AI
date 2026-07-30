const mysql = require('mysql2/promise');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('ERROR: DATABASE_URL is missing in .env file.');
    process.exit(1);
}

const isCloudDB = dbUrl.includes('aivencloud.com');

const pool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: isCloudDB ? { rejectUnauthorized: false } : undefined
});

pool.getConnection()
    .then(conn => {
        if (isCloudDB) {
            console.log('Connected to AIVEN (Cloud) MySQL Database');
        } else {
            console.log('Connected to LOCAL (Laptop) MySQL Database');
        }
        conn.release();
    })
    .catch(err => {
        console.error('MySQL Connection Error:', err.message);
    });

module.exports = pool;