const FormData = require('form-data');
const axios = require('axios');

async function test() {
  try {
    const formData = new FormData();
    formData.append('pdf', Buffer.from('fake pdf content'), {
      filename: 'test.pdf',
      contentType: 'application/pdf',
    });

    console.log('Sending upload request to StudyStack...');
    const uploadRes = await axios.post('https://summerpep2026.onrender.com/api/genai/upload', formData, {
      headers: formData.getHeaders(),
    });
    console.log('Upload success:', uploadRes.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.status + ' ' + JSON.stringify(err.response.data) : err.message);
  }
}

test();
