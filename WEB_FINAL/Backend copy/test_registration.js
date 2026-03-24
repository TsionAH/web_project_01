const http = require('http');

console.log('🧪 Testing registration API...');

const testData = JSON.stringify({
  email: 'test@aau.edu.et',
  password: 'password123',
  full_name: 'Test User',
  student_id: 'TEST/1234/14'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    try {
      const parsed = JSON.parse(data);
      if (parsed.success) {
        console.log('✅ Registration test PASSED!');
      } else {
        console.log('❌ Registration test FAILED:', parsed.error);
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', data);
    }
    
    process.exit();
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.write(testData);
req.end();