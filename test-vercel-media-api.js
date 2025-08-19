/**
 * Test script for verifying the media upload API on Vercel
 * 
 * Run this script with Node.js after deployment to verify the API works correctly
 * 
 * Usage: node test-vercel-media-api.js <vercel-url> <auth-token>
 * Example: node test-vercel-media-api.js https://your-app.vercel.app eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:3000';
const authToken = args[1] || 'your-auth-token';

// Test image path (replace with your test image)
const testImagePath = path.join(__dirname, 'public', 'next.svg');

// Function to test uploading a file
async function testUpload() {
  console.log('Testing file upload...');
  
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));
    formData.append('customId', 'test-vercel-' + Date.now());
    formData.append('fileType', 'image');
    
    const response = await fetch(`${baseUrl}/api/mediaupload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('Upload result:', result);
    
    if (result.success) {
      return result.media;
    } else {
      throw new Error('Upload failed: ' + (result.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to test retrieving a file
async function testRetrieve(filePath) {
  console.log('Testing file retrieval...');
  
  try {
    const response = await fetch(`${baseUrl}/api/mediaupload?filePath=${encodeURIComponent(filePath)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve file: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    console.log('Retrieval successful:');
    console.log('- Content Type:', contentType);
    console.log('- Content Length:', contentLength);
    
    return true;
  } catch (error) {
    console.error('Error retrieving file:', error);
    throw error;
  }
}

// Function to test deleting a file
async function testDelete(filePath) {
  console.log('Testing file deletion...');
  
  try {
    const response = await fetch(`${baseUrl}/api/mediaupload?filePath=${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const result = await response.json();
    console.log('Deletion result:', result);
    
    return result.success;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Run all tests
async function runTests() {
  console.log('=== Testing Media Upload API on Vercel ===');
  console.log('Base URL:', baseUrl);
  
  try {
    // Test upload
    const uploadedMedia = await testUpload();
    console.log('\n✅ Upload test passed');
    
    // Test retrieve
    await testRetrieve(uploadedMedia.filePath);
    console.log('\n✅ Retrieval test passed');
    
    // Test delete
    await testDelete(uploadedMedia.filePath);
    console.log('\n✅ Deletion test passed');
    
    console.log('\n🎉 All tests passed! The API is working correctly on Vercel.');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();