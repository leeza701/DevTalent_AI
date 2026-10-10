require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const recruiter = await User.findOne({ role: 'recruiter' });
  console.log('Recruiter:', recruiter.email);
  process.exit(0);
});
