const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const server = http.createServer(async (req, res) => {
  // =====================
  // CORS HEADERS - FIXED FOR VITE (port 5173)
  // =====================
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // =====================
  // PARSE URL
  // =====================
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`🌐 ${method} ${path}`);

  // =====================
  // PARSE BODY
  // =====================
  if (method === 'POST' || method === 'PUT') {
    try {
      const body = await parseRequestBody(req);
      req.body = body;
    } catch (error) {
      console.error('Error parsing body:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body' }));
      return;
    }
  }

  // =====================
  // ROUTES
  // =====================
  try {
    // Test endpoint
    // In server.js, add this BEFORE other routes:
if (path === '/api/debug/users/me' && method === 'GET') {
  console.log('🧪 DEBUG /api/debug/users/me called');
  console.log('Headers:', req.headers);
  
  // Simple test response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
      success: true,
      message: 'Debug endpoint works!',
      timestamp: new Date().toISOString()
  }));
  return;
}
    if (path === '/api/test' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Health check
    if (path === '/api/health' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'healthy',
        uptime: process.uptime()
      }));
      return;
    }

    // AUTH ROUTES
    if (path === '/api/auth/register' && method === 'POST') {
      await authRoutes.register(req, res);
      return;
    }

    if (path === '/api/auth/login' && method === 'POST') {
      await authRoutes.login(req, res);
      return;
    }

    // USER ROUTES
    if (path === '/api/users' && method === 'GET') {
      await userRoutes.getUsers(req, res);
      return;
    }

    if (path === '/api/users/me' && method === 'GET') {
      await userRoutes.getCurrentUser(req, res);
      return;
    }

    // POST ROUTES
    if (path === '/api/posts' && method === 'GET') {
      await postRoutes.getPosts(req, res);
      return;
    }

    if (path === '/api/posts' && method === 'POST') {
      await postRoutes.createPost(req, res);
      return;
    }

    if (path.startsWith('/api/posts/') && path.endsWith('/like') && method === 'POST') {
      const postId = path.split('/')[3];
      await postRoutes.toggleLike(req, res, postId);
      return;
    }
    // USER ROUTES
if (path === '/api/users/me' && method === 'GET') {
  await userRoutes.getCurrentUser(req, res);
  return;
}

if (path.startsWith('/api/users/') && method === 'GET') {
  const pathParts = path.split('/');
  if (pathParts.length === 4 && pathParts[3] !== 'me') {
    const userId = pathParts[3];
    await userRoutes.getUserById(req, res, userId);
    return;
  }
}

if (path === '/api/users/profile' && method === 'PUT') {
  await userRoutes.updateProfile(req, res);
  return;
}

if (path === '/api/users/profile/picture' && method === 'PUT') {
  await userRoutes.updateProfilePicture(req, res);
  return;
}

if (path === '/api/users/profile/cover' && method === 'PUT') {
  await userRoutes.updateCoverPhoto(req, res);
  return;
}

if (path === '/api/users/password' && method === 'PUT') {
  await userRoutes.changePassword(req, res);
  return;
}

if (path.startsWith('/api/users/') && path.endsWith('/posts') && method === 'GET') {
  const pathParts = path.split('/');
  const userId = pathParts[3];
  await userRoutes.getUserPosts(req, res, userId);
  return;
}

if (path.startsWith('/api/users/') && path.endsWith('/follow') && method === 'POST') {
  const pathParts = path.split('/');
  const userId = pathParts[3];
  await userRoutes.toggleFollow(req, res, userId);
  return;
}

    if (path.startsWith('/api/posts/') && path.endsWith('/comments') && method === 'POST') {
      const postId = path.split('/')[3];
      await postRoutes.addComment(req, res, postId);
      return;
    }
// In server.js, add these routes:

// USER ROUTES
if (path === '/api/users/me' && method === 'GET') {
  await userRoutes.getCurrentUser(req, res);
  return;
}

// Get user by ID
if (path.startsWith('/api/users/') && method === 'GET') {
  const pathParts = path.split('/');
  if (pathParts.length === 4) {
    const userId = pathParts[3];
    if (userId !== 'me') { // Skip if it's /api/users/me
      await userRoutes.getUserById(req, res, userId);
      return;
    }
  }
}

// Update profile
if (path === '/api/users/profile' && method === 'PUT') {
  await userRoutes.updateProfile(req, res);
  return;
}

// Update profile picture
if (path === '/api/users/profile/picture' && method === 'PUT') {
  await userRoutes.updateProfilePicture(req, res);
  return;
}

// Update cover photo
if (path === '/api/users/profile/cover' && method === 'PUT') {
  await userRoutes.updateCoverPhoto(req, res);
  return;
}

// Change password
if (path === '/api/users/password' && method === 'PUT') {
  await userRoutes.changePassword(req, res);
  return;
}

// Get user posts
if (path.startsWith('/api/users/') && path.endsWith('/posts') && method === 'GET') {
  const pathParts = path.split('/');
  if (pathParts.length === 5) { // /api/users/{id}/posts
    const userId = pathParts[3];
    await userRoutes.getUserPosts(req, res, userId);
    return;
  }
}

// Toggle follow
if (path.startsWith('/api/users/') && path.endsWith('/follow') && method === 'POST') {
  const pathParts = path.split('/');
  if (pathParts.length === 5) { // /api/users/{id}/follow
    const userId = pathParts[3];
    await userRoutes.toggleFollow(req, res, userId);
    return;
  }
}
// Add this AFTER your other routes but BEFORE 404 handler

// SIMPLE USER ROUTES - TEMPORARY FIX
if (path === '/api/users/me' && method === 'GET') {
  console.log('🛠️ TEMP: /api/users/me called');
  
  try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No token provided' }));
          return;
      }
      
      // Simple response (temporary)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
          success: true,
          user: {
              id: 1,
              email: 'test@aau.edu.et',
              full_name: 'Test User',
              student_id: 'TEST/1234/14',
              department: 'Computer Science',
              year_of_study: 3,
              profile_picture: null,
              cover_photo: null,
              bio: 'Test bio',
              location: 'Addis Ababa',
              phone: '+251 911 223344',
              created_at: new Date().toISOString(),
              posts_count: 5,
              followers_count: 10,
              following_count: 8
          }
      }));
  } catch (error) {
      console.error('Error in temp /users/me:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
  }
  return;
}
// In server.js, add this route (after the GET and POST /api/posts routes):

// DELETE post route
if (path.startsWith('/api/posts/') && method === 'DELETE') {
  const pathParts = path.split('/');
  if (pathParts.length === 4 && pathParts[3] !== 'like' && pathParts[3] !== 'comments') {
    const postId = pathParts[3];
    await postRoutes.deletePost(req, res, postId);
    return;
  }
}

if (path.startsWith('/api/users/') && path.endsWith('/posts') && method === 'GET') {
  const pathParts = path.split('/');
  const userId = pathParts[3];
  console.log(`🛠️ TEMP: /api/users/${userId}/posts called`);
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
      success: true,
      posts: [] // Empty array for now
  }));
  return;
}
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Route not found',
      path: path,
      method: method 
    }));

  } catch (error) {
    console.error('🚨 Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
});

// =====================
// HELPER: PARSE BODY
// =====================
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(querystring.parse(body));
      }
    });

    req.on('error', reject);
  });
}

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: localhost:3000, localhost:5173`);
  console.log('\n📡 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/posts`);
  console.log(`   POST http://localhost:${PORT}/api/posts`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('💡 Try changing PORT in .env file or kill the process:');
    console.log('   Windows: netstat -ano | findstr :5000');
    console.log('   Mac/Linux: lsof -i :5000');
  } else {
    console.error('Server error:', error);
  }
});