require('dotenv').config();
const mongoose = require('mongoose');

// Define the MongoDB URI from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api_rgram';

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get the Media collection
    const Media = mongoose.connection.collection('media');
    
    // Find the most recent media record
    const media = await Media.findOne({}, { sort: { createdAt: -1 } });
    
    console.log('Most recent media record:', media);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();