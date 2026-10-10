const User = require('../models/User');
const Job = require('../models/Job');
const CustomAssessment = require('../models/CustomAssessment');

exports.getStats = async (req, res) => {
  try {
    const candidatesCount = await User.countDocuments({ role: 'developer' });
    const jobsCount = await Job.countDocuments({});
    const assessmentsCount = await CustomAssessment.countDocuments({});

    res.status(200).json({
      success: true,
      data: {
        candidates: candidatesCount,
        jobs: jobsCount,
        assessments: assessmentsCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server validation error calculating platform stats.' });
  }
};
