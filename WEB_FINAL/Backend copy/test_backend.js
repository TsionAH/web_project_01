// backend/test_backend.js
const http = require('http');

const endpoints = [
  { path: '/api/test', method: 'GET' },
  { path: '/api/auth/register', method: 'POST' },
  { path: '/api/users/me', method: 'GET' },
  { path: '/api/users/1/posts', method: 'GET' }
];

console.log('🧪 Testing backend endpoints...\n');

endpoints.forEach((endpoint, index) => {
  setTimeout(() => {
    console.log(`\n${index + 1}. Testing ${endpoint.method} ${endpoint.path}`);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`   Response: ${JSON.stringify(parsed).substring(0, 100)}...`);
        } catch {
          console.log(`   Response: ${data.substring(0, 100)}...`);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
    });

    if (endpoint.method === 'POST') {
      req.write(JSON.stringify({ test: 'data' }));
    }
    
    req.end();
  }, index * 500);
});