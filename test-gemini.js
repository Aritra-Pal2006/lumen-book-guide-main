const https = require('https');

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: 'Recommend 3 books for someone who likes mystery novels'
    }]
  }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: '/v1beta/models/gemini-pro:generateContent?key=AIzaSyDDET3zMEFBrc-8UZAv5KvcfE_mQsHm03M',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', chunk => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(responseData);
      console.log('Response:', JSON.stringify(jsonData, null, 2));
      
      if (jsonData.error) {
        console.log('API Error:', jsonData.error.message);
      } else {
        console.log('API Success! Response received.');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', error => {
  console.error('Request error:', error);
});

req.write(data);
req.end();