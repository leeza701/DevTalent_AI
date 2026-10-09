const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = process.env.MONGODB_URI || 'mongodb://localhost:27017/devtalent-ai-dev';
    await mongoose.connect(conn);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
