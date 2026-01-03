// Test MongoDB Atlas connection
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
console.log('Testing connection to:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Disconnected');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
