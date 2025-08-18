const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTJiZjcxNjg0MzJiYTdmODk2MWRkNCIsImVtYWlsIjoidGVzdDRAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyNCIsImlhdCI6MTc1NTQ5NjMwNSwiZXhwIjoxNzU2MTAxMTA1fQ.6wz-onXWmw2OpENCn6GAvRi5TpQouaP1EqDfmbXlKuA';
const mediaId = '68a2bfa368432ba7f8961dd7';

async function deleteMedia() {
  try {
    const response = await fetch(`http://localhost:3002/api/media/delete?id=${mediaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteMedia();