// Create a file: backend/list_routes.js
const fs = require('fs');
const serverCode = fs.readFileSync('./server.js', 'utf8');

console.log('🔍 Searching for routes in server.js...');

// Find all route patterns
const routePatterns = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/users/me',
    '/api/users/',
    '/api/users/{id}/posts',
    '/api/posts'
];

routePatterns.forEach(route => {
    if (serverCode.includes(route)) {
        console.log(`✅ Found: ${route}`);
    } else {
        console.log(`❌ Missing: ${route}`);
    }
});

// Check for user routes
if (serverCode.includes('userRoutes.getCurrentUser')) {
    console.log('✅ Found userRoutes.getCurrentUser');
} else {
    console.log('❌ Missing userRoutes.getCurrentUser');
}

if (serverCode.includes('userRoutes.getUserPosts')) {
    console.log('✅ Found userRoutes.getUserPosts');
} else {
    console.log('❌ Missing userRoutes.getUserPosts');
}