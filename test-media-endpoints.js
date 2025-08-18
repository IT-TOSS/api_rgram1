const FormData = require('form-data');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTJiZjcxNjg0MzJiYTdmODk2MWRkNCIsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyNCIsImlhdCI6MTc1NTQ5NjMwNSwiZXhwIjoxNzU2MTAxMTA1fQ.6wz-onXWmw2OpENCn6GAvRi5TpQouaP1EqDfmbXlKuA';
const API_BASE = 'http://localhost:3000/api/media';

async function testMediaEndpoints() {
  try {
    console.log('=== Testing Media Endpoints ===');
    
    // 1. Upload a file
    console.log('\n1. Testing Upload Endpoint...');
    const form = new FormData();
    form.append('file', fs.createReadStream('package.json'));
    
    const uploadResponse = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: form
    });
    
    const uploadData = await uploadResponse.json();
    console.log('Upload response:', uploadData);
    
    if (!uploadData.success) {
      console.error('Upload failed');
      return;
    }
    
    const mediaId = uploadData.media.id;
    console.log('Media ID:', mediaId);
    
    // 2. Rename the file
    console.log('\n2. Testing Rename Endpoint...');
    const renameResponse = await fetch(`${API_BASE}/rename`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        mediaId: mediaId,
        newName: 'test-renamed-file'
      })
    });
    
    const renameData = await renameResponse.json();
    console.log('Rename response:', renameData);
    
    // 3. Delete the file
    console.log('\n3. Testing Delete Endpoint...');
    const deleteResponse = await fetch(`${API_BASE}/delete?id=${mediaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    const deleteData = await deleteResponse.json();
    console.log('Delete response:', deleteData);
    
    console.log('\n=== All tests completed ===');
    
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

testMediaEndpoints();