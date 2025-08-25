const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Change this to your server URL
const USER_ID = 'YOUR_USER_ID_HERE'; // Replace with actual user ID
const TEST_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

// Test functions
async function testGetPrivacyStatus() {
  try {
    console.log('🔍 Testing GET /api/user/' + USER_ID + '/privacy - Get current privacy status');
    
    const response = await axios.get(`${BASE_URL}/api/user/${USER_ID}/privacy`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error getting privacy status:', error.response?.data || error.message);
  }
}

async function testSetPrivateAccount() {
  try {
    console.log('\n🔒 Testing PUT /api/user/' + USER_ID + '/privacy - Set account to private');
    
    const response = await axios.put(`${BASE_URL}/api/user/${USER_ID}/privacy`, {
      isPrivate: true
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error setting private account:', error.response?.data || error.message);
  }
}

async function testSetPublicAccount() {
  try {
    console.log('\n🌐 Testing PUT /api/user/' + USER_ID + '/privacy - Set account to public');
    
    const response = await axios.put(`${BASE_URL}/api/user/${USER_ID}/privacy`, {
      isPrivate: false
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error setting public account:', error.response?.data || error.message);
  }
}

async function testTogglePrivacy() {
  try {
    console.log('\n🔄 Testing PUT /api/user/' + USER_ID + '/toggle-privacy - Toggle privacy status');
    
    const response = await axios.put(`${BASE_URL}/api/user/${USER_ID}/toggle-privacy`, {}, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error toggling privacy:', error.response?.data || error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Privacy API Tests\n');
  console.log('=====================================');
  console.log('Base URL:', BASE_URL);
  console.log('User ID:', USER_ID);
  console.log('=====================================');
  
  if (USER_ID === 'YOUR_USER_ID_HERE' || TEST_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
    console.log('\n⚠️  Please set valid USER_ID and TEST_TOKEN to run tests');
    console.log('   You can get these by logging in through the auth API');
    return;
  }

  await testGetPrivacyStatus();
  await testSetPrivateAccount();
  await testGetPrivacyStatus();
  await testSetPublicAccount();
  await testGetPrivacyStatus();
  await testTogglePrivacy();
  await testGetPrivacyStatus();
  
  console.log('\n=====================================');
  console.log('🏁 Privacy API Tests Completed');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testGetPrivacyStatus,
  testSetPrivateAccount,
  testSetPublicAccount,
  testTogglePrivacy,
  runAllTests
};
