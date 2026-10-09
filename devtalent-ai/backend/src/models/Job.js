const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  originalDescription: {
    type: String,
    required: [true, 'Please add the raw job description text']
  },
  requirements: {
    skills: [String],
    minYearsExperience: {
      type: Number,
      default: 0
    },
    education: {
      type: String,
      default: 'Not specified'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
