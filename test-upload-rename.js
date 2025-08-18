const FormData = require('form-data');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTJiZjcxNjg0MzJiYTdmODk2MWRkNCIsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyNCIsImlhdCI6MTc1NTQ5NjMwNSwiZXhwIjoxNzU2MTAxMTA1fQ.6wz-onXWmw2OpENCn6GAvRi5TpQouaP1EqDfmbXlKuA';

async function uploadAndRename() {
  try {
    // First upload a file
    const form = new FormData();
    form.append('file', fs.createReadStream('package.json'));
    
    const uploadResponse = await fetch('http://localhost:3000/api/media/upload', {
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
    
    // Then rename the file
    const renameResponse = await fetch('http://localhost:3000/api/media/rename', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        mediaId: mediaId,
        newName: 'renamed-package.json'
      })
    });
    
    const renameData = await renameResponse.json();
    console.log('Rename response:', renameData);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadAndRename();