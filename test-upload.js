const FormData = require('form-data');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTJiZjcxNjg0MzJiYTdmODk2MWRkNCIsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyNCIsImlhdCI6MTc1NTQ5NjMwNSwiZXhwIjoxNzU2MTAxMTA1fQ.6wz-onXWmw2OpENCn6GAvRi5TpQouaP1EqDfmbXlKuA';

async function uploadFile() {
  const form = new FormData();
  form.append('file', fs.createReadStream('package.json'));
  
  try {
    const response = await fetch('http://localhost:3002/api/media/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: form
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadFile();