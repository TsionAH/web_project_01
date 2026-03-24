// backend/test_delete.js
const http = require('http');

console.log('🧪 Testing Delete Post Functionality\n');

// Test data
const loginData = JSON.stringify({
  email: 'test@aau.edu.et',
  password: 'password123'
});

// 1. Login to get token
console.log('1. Logging in...');
const loginReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  console.log('   Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => data += chunk);
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.token) {
        console.log('   ✅ Login successful');
        const token = parsed.token;
        
        // 2. Create a post to delete
        console.log('\n2. Creating a test post...');
        createTestPost(token);
      } else {
        console.log('   ❌ Login failed:', parsed);
      }
    } catch (e) {
      console.log('   ❌ Parse error:', data);
    }
  });
});

loginReq.write(loginData);
loginReq.end();

function createTestPost(token) {
  const postData = JSON.stringify({
    content: 'Test post to be deleted',
    image_url: null
  });

  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/posts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, (res) => {
    console.log('   Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.success) {
          console.log('   ✅ Post created, ID:', parsed.post.id);
          console.log('\n3. Testing delete...');
          testDeletePost(token, parsed.post.id);
        } else {
          console.log('   ❌ Post creation failed:', parsed);
        }
      } catch (e) {
        console.log('   ❌ Parse error:', data);
      }
    });
  });

  req.write(postData);
  req.end();
}

function testDeletePost(token, postId) {
  const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/posts/${postId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, (res) => {
    console.log('   Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => data += chunk);
    
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.success) {
          console.log('   ✅ Post deleted successfully!');
          console.log('\n🎉 DELETE POST FUNCTIONALITY WORKS!');
        } else {
          console.log('   ❌ Delete failed:', parsed);
        }
      } catch (e) {
        console.log('   ❌ Parse error:', data);
      }
      process.exit();
    });
  });

  req.end();
}