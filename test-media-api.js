// Test script for Media Management API
const API_BASE = 'http://localhost:3000/api';

// Function to get JWT token (you would need to implement this with your auth system)
async function getAuthToken() {
  // For testing purposes, you can:
  // 1. Use a hardcoded token (if you have a valid one)
  // 2. Make a login request to get a token
  // 3. Use localStorage if testing in browser
  
  // Example login request:
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'your-test-email@example.com', // Replace with test credentials
        password: 'your-test-password'
      })
    });
    
    const data = await response.json();
    if (data.success && data.token) {
      return data.token;
    } else {
      console.error('Login failed:', data.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Test uploading a file
async function testUpload() {
  console.log('🔍 Testing Media Upload API...');
  
  try {
    const token = await getAuthToken();
    if (!token) {
      console.error('❌ Authentication failed. Cannot proceed with tests.');
      return;
    }
    
    // In a browser environment, you would use FormData with actual files
    // For this Node.js script, we'll create a simple FormData-like object
    const formData = new FormData();
    
    // You would add a file in browser: formData.append('file', fileInput.files[0]);
    // For testing in Node.js without a browser, you'd need to use a library like 'form-data'
    // and fs to read a file from disk
    
    console.log('🔑 Using token:', token);
    console.log('📤 Sending request to:', `${API_BASE}/media/manage`);
    
    // Log the authorization header to verify it's correct
    console.log('🔐 Authorization header:', `Bearer ${token}`);
    
    // This is a placeholder for the actual request
    // In a real test, you would send the formData with a file
    console.log('⚠️ This is a test script. To perform an actual upload:');
    console.log('1. Use the media-api-demo.html in your browser');
    console.log('2. Or modify this script to use form-data package with fs to read files');
    
    // Example of what the actual request would look like:
    /*
    const response = await fetch(`${API_BASE}/media/manage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    console.log('✅ Upload Response:', data);
    */
  } catch (error) {
    console.error('❌ Upload Test Error:', error);
  }
}

// Test getting media list
async function testGetMediaList() {
  console.log('🔍 Testing Get Media List API...');
  
  try {
    const token = await getAuthToken();
    if (!token) {
      console.error('❌ Authentication failed. Cannot proceed with tests.');
      return;
    }
    
    const response = await fetch(`${API_BASE}/media/manage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('✅ Media List Response:', data);
  } catch (error) {
    console.error('❌ Get Media List Error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Media API Tests');
  await testUpload();
  await testGetMediaList();
  console.log('🏁 Tests completed');
}

runTests();