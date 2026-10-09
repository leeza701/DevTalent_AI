const Job = require('../models/Job');
const Resume = require('../models/Resume');

exports.getMatchesForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Retrieve ALL resumes across the platform so the recruiter can search the entire candidate pool
    const resumes = await Resume.find({});
    
    const requiredSkills = job.requirements?.skills || [];
    
    // Algorithmic overlap scorer
    const scoredCandidates = resumes.map((resume) => {
      const candidateSkills = resume.skills || [];
      
      // Normalize both arrays for case-insensitive exact matching
      const normalizedReqs = requiredSkills.map(s => s.toLowerCase().trim());
      const normalizedCandidate = candidateSkills.map(s => s.toLowerCase().trim());
      
      const overlap = normalizedReqs.filter(req => normalizedCandidate.includes(req));
      const score = requiredSkills.length > 0 ? Math.round((overlap.length / requiredSkills.length) * 100) : 0;

      return {
        _id: resume._id,
        fileName: resume.fileName,
        candidateSkills: resume.skills,
        experience: resume.experience,
        score: score,
        matchedSkills: overlap,
      };
    });

    // Sort by highest match score first
    scoredCandidates.sort((a, b) => b.score - a.score);

    res.status(200).json({ 
      success: true, 
      count: scoredCandidates.length, 
      data: scoredCandidates 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
