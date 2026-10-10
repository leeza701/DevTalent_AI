require('dotenv').config();
const mongoose = require('mongoose');
const Resume = require('./models/Resume');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const candidates = await Resume.find().populate('user', 'name email').sort('-createdAt');
    console.log('Candidates length:', candidates.length);
    console.log(candidates);
  } catch (err) {
    console.log('Error sorting/populating:', err);
  }
  process.exit(0);
});
