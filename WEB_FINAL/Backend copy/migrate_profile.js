// backend/migrate_profile.js
const mysql = require('mysql2');
require('dotenv').config();

console.log('🔄 Running profile migration...');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aau_social_media',
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to database');

  const migrations = [
    // Add profile columns to users table
    `ALTER TABLE users 
     ADD COLUMN IF NOT EXISTS profile_picture TEXT,
     ADD COLUMN IF NOT EXISTS cover_photo TEXT,
     ADD COLUMN IF NOT EXISTS bio TEXT,
     ADD COLUMN IF NOT EXISTS location VARCHAR(255),
     ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`,

    // Create posts table
    `CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      likes_count INT DEFAULT 0,
      comments_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    // Create followers table
    `CREATE TABLE IF NOT EXISTS followers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      follower_id INT NOT NULL,
      following_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_follow (follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  let completed = 0;
  const total = migrations.length;

  migrations.forEach((sql, index) => {
    connection.query(sql, (error, results) => {
      if (error) {
        console.error(`❌ Migration ${index + 1} failed:`, error.message);
      } else {
        console.log(`✅ Migration ${index + 1} completed`);
      }
      
      completed++;
      
      if (completed === total) {
        console.log('\n🎉 All migrations completed!');
        console.log('\n📊 Database now has:');
        
        // Show tables
        connection.query('SHOW TABLES', (err, tables) => {
          tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   - ${tableName}`);
          });
          
          connection.release();
          process.exit(0);
        });
      }
    });
  });
});