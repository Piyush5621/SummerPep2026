const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.DATABASE || process.env.MONGODB_URI;

  if (!uri) {
    console.warn('DATABASE environment variable is missing; continuing without MongoDB.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Database connection established');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed; continuing without DB for local/demo mode.', error.message);
    return false;
  }
};

module.exports = connectDB;
