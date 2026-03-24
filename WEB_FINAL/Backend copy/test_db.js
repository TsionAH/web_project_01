const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Checking database connection...');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aau_social_media',
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed!');
    console.error('Error:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Is MySQL running?');
    console.log('2. Check .env file:');
    console.log('   DB_HOST=' + (process.env.DB_HOST || 'localhost'));
    console.log('   DB_USER=' + (process.env.DB_USER || 'root'));
    console.log('   DB_PASSWORD=' + (process.env.DB_PASSWORD ? '***' : '(empty)'));
    console.log('   DB_NAME=' + (process.env.DB_NAME || 'aau_social_media'));
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Try empty password in .env:');
      console.log('DB_PASSWORD=');
    }
    
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database does not exist. Creating it...');
      
      // Create database
      const adminPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      });
      
      adminPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'aau_social_media'}`, (err) => {
        if (err) {
          console.error('Failed to create database:', err.message);
        } else {
          console.log('✅ Database created!');
          
          // Now create users table
          const dbPool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'aau_social_media',
          });
          
          dbPool.query(`
            CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              full_name VARCHAR(100) NOT NULL,
              student_id VARCHAR(50),
              department VARCHAR(100),
              year_of_study INT,
              profile_picture TEXT,
              bio TEXT,
              email_verified BOOLEAN DEFAULT FALSE,
              verification_token VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `, (err) => {
            if (err) {
              console.error('Failed to create users table:', err.message);
            } else {
              console.log('✅ Users table created!');
            }
            process.exit();
          });
        }
      });
    }
    
  } else {
    console.log('✅ Database connection successful!');
    
    // Check if users table exists
    connection.query('SHOW TABLES LIKE "users"', (err, results) => {
      if (err) {
        console.error('Error checking tables:', err.message);
      } else if (results.length === 0) {
        console.log('⚠️  Users table does not exist. Creating it...');
        
        connection.query(`
          CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            student_id VARCHAR(50),
            department VARCHAR(100),
            year_of_study INT,
            profile_picture TEXT,
            bio TEXT,
            email_verified BOOLEAN DEFAULT FALSE,
            verification_token VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Failed to create users table:', err.message);
          } else {
            console.log('✅ Users table created!');
            
            // Add test user
            const bcrypt = require('bcryptjs');
            bcrypt.hash('password123', 10, (err, hash) => {
              connection.query(
                'INSERT IGNORE INTO users (email, password_hash, full_name, student_id, email_verified) VALUES (?, ?, ?, ?, ?)',
                ['test@aau.edu.et', hash, 'Test User', 'TEST/1234/14', true],
                (err) => {
                  if (err) {
                    console.error('Failed to add test user:', err.message);
                  } else {
                    console.log('✅ Test user added: test@aau.edu.et / password123');
                  }
                  connection.release();
                  process.exit();
                }
              );
            });
          }
        });
      } else {
        console.log('✅ Users table exists');
        connection.query('SELECT COUNT(*) as count FROM users', (err, results) => {
          if (err) {
            console.error('Error counting users:', err.message);
          } else {
            console.log(`👥 Total users in database: ${results[0].count}`);
          }
          connection.release();
          process.exit();
        });
      }
    });
  }
});