const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  MongoDB URI not defined. Using development mode with mock data.');
    console.log('To use MongoDB, set MONGO_URI in backend/.env');
    return true; // Allow dev to proceed without MongoDB
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.log('Proceeding in development mode without database persistence.');
    return true; // Continue without database for development
  }
};

module.exports = connectDB;
