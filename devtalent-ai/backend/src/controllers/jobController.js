const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const { title, company, originalDescription } = req.body;

    if (!title || !company || !originalDescription) {
      return res.status(400).json({ success: false, error: 'Please provide title, company, and description' });
    }

    // SIMULATED MOCK AI ENGINE for Job Extraction
    // Automatically extracting mock criteria to bypass API keys
    const extractedRequirements = {
      skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript"],
      minYearsExperience: 3,
      education: "Bachelor's Degree in Computer Science or related field"
    };

    const job = await Job.create({
      recruiter: req.user.id,
      title,
      company,
      originalDescription,
      requirements: extractedRequirements
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
