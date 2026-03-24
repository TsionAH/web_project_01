const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aau_social_media',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection immediately
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('Check your .env file or run: node check_db.js');
  } else {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'aau_social_media');
    connection.release();
  }
});

module.exports = pool.promise();