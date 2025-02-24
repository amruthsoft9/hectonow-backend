// cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dfnvw0cwr', // Your cloud name from Cloudinary
  api_key: '326842122215463', // Your API key from Cloudinary
  api_secret: 'kfu1xMQQcM751IRFTFWhj0luIFE' // Your API secret from Cloudinary
});

module.exports = cloudinary;
