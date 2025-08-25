const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5001';
const TEST_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

// Test functions
async function testGetPrivacyStatus() {
  try {
    console.log('🔍 Testing GET /api/user/privacy - Get current privacy status');
    
    const response = await axios.get(`${BASE_URL}/api/user/privacy`, {
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
    console.log('\n🔒 Testing PUT /api/user/privacy - Set account to private');
    
    const response = await axios.put(`${BASE_URL}/api/user/privacy`, {
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
    console.log('\n🌐 Testing PUT /api/user/privacy - Set account to public');
    
    const response = await axios.put(`${BASE_URL}/api/user/privacy`, {
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
    console.log('\n🔄 Testing PUT /api/user/toggle-privacy - Toggle privacy status');
    
    const response = await axios.put(`${BASE_URL}/api/user/toggle-privacy`, {}, {
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

async function testInvalidInput() {
  try {
    console.log('\n🚫 Testing PUT /api/user/privacy - Invalid input validation');
    
    const response = await axios.put(`${BASE_URL}/api/user/privacy`, {
      isPrivate: 'invalid_value'
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Expected validation error:', error.response?.data || error.message);
  }
}

async function testUnauthorized() {
  try {
    console.log('\n🚫 Testing GET /api/user/privacy - Unauthorized access');
    
    const response = await axios.get(`${BASE_URL}/api/user/privacy`);
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Expected unauthorized error:', error.response?.data || error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Privacy API Tests\n');
  console.log('=====================================');
  
  // Test unauthorized access first
  await testUnauthorized();
  
  // Test with valid token
  if (TEST_TOKEN !== 'YOUR_JWT_TOKEN_HERE') {
    await testGetPrivacyStatus();
    await testSetPrivateAccount();
    await testGetPrivacyStatus();
    await testSetPublicAccount();
    await testGetPrivacyStatus();
    await testTogglePrivacy();
    await testGetPrivacyStatus();
    await testInvalidInput();
  } else {
    console.log('\n⚠️  Please set a valid TEST_TOKEN to run authenticated tests');
    console.log('   You can get a token by logging in through the auth API');
  }
  
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
  testInvalidInput,
  testUnauthorized,
  runAllTests
};
