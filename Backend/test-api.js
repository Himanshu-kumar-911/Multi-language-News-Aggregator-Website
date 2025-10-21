#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'testuser123',
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  preferredLanguage: 'en'
};

let authToken = null;
let adminToken = null;

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return { response, data };
}

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  const { response, data } = await apiCall('/health');
  
  if (response.ok) {
    console.log('✅ Health check passed');
    console.log(`   Status: ${data.status}`);
  } else {
    console.log('❌ Health check failed');
    console.log(`   Error: ${data.message}`);
  }
  console.log('');
}

async function testRegister() {
  console.log('🔍 Testing user registration...');
  const { response, data } = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (response.ok) {
    console.log('✅ Registration successful');
    authToken = data.data.token;
    console.log(`   User ID: ${data.data.user._id}`);
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Registration failed');
    console.log(`   Error: ${data.message}`);
    if (data.errors) {
      data.errors.forEach(error => console.log(`   - ${error.msg}`));
    }
  }
  console.log('');
}

async function testLogin() {
  console.log('🔍 Testing user login...');
  const { response, data } = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: testUser.email,
      password: testUser.password
    })
  });
  
  if (response.ok) {
    console.log('✅ Login successful');
    authToken = data.data.token;
    console.log(`   User: ${data.data.user.username}`);
  } else {
    console.log('❌ Login failed');
    console.log(`   Error: ${data.message}`);
  }
  console.log('');
}

async function testProfile() {
  console.log('🔍 Testing profile fetch...');
  const { response, data } = await apiCall('/auth/profile');
  
  if (response.ok) {
    console.log('✅ Profile fetch successful');
    console.log(`   Username: ${data.data.user.username}`);
    console.log(`   Email: ${data.data.user.email}`);
  } else {
    console.log('❌ Profile fetch failed');
    console.log(`   Error: ${data.message}`);
  }
  console.log('');
}

async function testNews() {
  console.log('🔍 Testing news endpoints...');
  
  // Test general news
  const { response: newsResponse, data: newsData } = await apiCall('/news');
  if (newsResponse.ok) {
    console.log('✅ General news fetch successful');
    console.log(`   Articles count: ${newsData.data.articles.length}`);
  } else {
    console.log('❌ General news fetch failed');
  }
  
  // Test category news
  const { response: catResponse, data: catData } = await apiCall('/news/category/technology');
  if (catResponse.ok) {
    console.log('✅ Category news fetch successful');
    console.log(`   Category: ${catData.data.category}`);
  } else {
    console.log('❌ Category news fetch failed');
  }
  
  // Test search
  const { response: searchResponse, data: searchData } = await apiCall('/news/search?q=technology');
  if (searchResponse.ok) {
    console.log('✅ News search successful');
    console.log(`   Query: ${searchData.data.query}`);
  } else {
    console.log('❌ News search failed');
  }
  
  console.log('');
}

async function testAdminLogin() {
  console.log('🔍 Testing admin login...');
  const { response, data } = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: 'superadmin',
      password: 'Admin123!@#'
    })
  });
  
  if (response.ok) {
    console.log('✅ Admin login successful');
    adminToken = data.data.token;
    console.log(`   Role: ${data.data.user.role}`);
    console.log(`   Permissions: ${data.data.user.permissions?.join(', ') || 'None'}`);
  } else {
    console.log('❌ Admin login failed');
    console.log(`   Error: ${data.message}`);
  }
  console.log('');
}

async function testAdminUsers() {
  console.log('🔍 Testing admin users endpoint...');
  const { response, data } = await apiCall('/admin/users', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  if (response.ok) {
    console.log('✅ Admin users fetch successful');
    console.log(`   Total users: ${data.data.pagination.totalUsers}`);
    console.log(`   Users returned: ${data.data.users.length}`);
  } else {
    console.log('❌ Admin users fetch failed');
    console.log(`   Error: ${data.message}`);
  }
  console.log('');
}

async function testAdminStats() {
  console.log('🔍 Testing admin stats endpoint...');
  const { response, data } = await apiCall('/admin/stats', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  if (response.ok) {
    console.log('✅ Admin stats fetch successful');
    console.log(`   Total users: ${data.data.totalUsers}`);
    console.log(`   Active users: ${data.data.activeUsers}`);
    console.log(`   Admin users: ${data.data.adminUsers}`);
  } else {
    console.log('❌ Admin stats fetch failed');
    console.log(`   Error: ${data.message}`);
  }
  console.log('');
}

// Main test function
async function runTests() {
  console.log('🧪 Starting API Tests\n');
  console.log('Make sure the server is running on http://localhost:5000\n');
  
  try {
    await testHealthCheck();
    await testRegister();
    await testLogin();
    await testProfile();
    await testNews();
    await testAdminLogin();
    await testAdminUsers();
    await testAdminStats();
    
    console.log('🎉 All tests completed!');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\nMake sure:');
    console.log('1. The server is running (npm run dev)');
    console.log('2. MongoDB is connected');
    console.log('3. All dependencies are installed');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };
