const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = process.env.MONGODB_URI;
    if (!conn) {
      console.error('MONGODB_URI is not set. Please add it to your environment variables.');
      return;
    }
    await mongoose.connect(conn);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit — let Express keep running so health checks and CORS work
  }
};

module.exports = connectDB;
