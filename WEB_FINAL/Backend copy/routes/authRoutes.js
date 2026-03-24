const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async register(req, res) {
    try {
      console.log('📝 Registration attempt received');
      
      const { email, password, full_name, student_id, department, year_of_study } = req.body;
      
      console.log('Data received:', { email, full_name, student_id });
      
      // 1. Validate AAU email
      if (!email || !email.endsWith('@aau.edu.et')) {
        console.log('❌ Invalid email:', email);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Only AAU email addresses (@aau.edu.et) are allowed' 
        }));
        return;
      }
      
      // 2. Check if user exists
      try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
          console.log('❌ Email already exists:', email);
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Email already registered' }));
          return;
        }
      } catch (dbError) {
        console.error('❌ Database query failed:', dbError.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database error', details: dbError.message }));
        return;
      }
      
      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ Password hashed');
      
      // 4. Insert user into database
      try {
        const [result] = await db.query(
          `INSERT INTO users (email, password_hash, full_name, student_id, department, year_of_study) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [email, hashedPassword, full_name, student_id, department, year_of_study]
        );
        
        console.log('✅ User inserted with ID:', result.insertId);
        
        // 5. Create JWT token
        const token = jwt.sign(
          { userId: result.insertId, email: email },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '7d' }
        );
        
        // 6. Send success response
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful!',
          user: {
            id: result.insertId,
            email: email,
            full_name: full_name,
            student_id: student_id
          },
          token: token
        }));
        
      } catch (insertError) {
        console.error('❌ Database insert failed:', insertError.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Failed to save user to database',
          details: insertError.message 
        }));
      }
      
    } catch (error) {
      console.error('🚨 Registration error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }));
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      console.log('🔑 Login attempt for:', email);
      
      // 1. Find user
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      
      if (users.length === 0) {
        console.log('❌ User not found:', email);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email or password' }));
        return;
      }
      
      const user = users[0];
      
      // 2. Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        console.log('❌ Invalid password for:', email);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid email or password' }));
        return;
      }
      
      // 3. Create JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );
      
      console.log('✅ Login successful for:', email);
      
      // 4. Send response
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      
      res.end(JSON.stringify({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          student_id: user.student_id,
          department: user.department
        }
      }));
      
    } catch (error) {
      console.error('🚨 Login error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Login failed' }));
    }
  }
};