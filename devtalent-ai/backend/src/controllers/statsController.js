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

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch assessments, populate the user to get their name, sort by score descending.
    const Assessment = require('../models/Assessment');
    const leaders = await Assessment.find()
      .populate('user', 'name')
      .sort({ score: -1 })
      .limit(50);
      
    // Filter out mock names / empty users if any
    const formattedLeaders = leaders.filter(doc => doc.user).map((doc, index) => ({
      rank: index + 1,
      name: doc.user.name,
      score: doc.score,
      topic: doc.topic,
      date: doc.createdAt
    }));
    
    res.status(200).json({
      success: true,
      data: formattedLeaders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch global leaderboard.' });
  }
};
