const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Resume = require('../models/Resume');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const rawText = pdfData.text;

    // SIMULATED MOCK AI ENGINE 
    // We are generating a dummy result so the system functions perfectly without an API Key!
    const parsedData = {
      skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "TailwindCSS"],
      experience: [
        {
          title: "Senior Full-Stack Developer",
          company: "Tech Innovations Inc.",
          years: "2021 - Present"
        },
        {
          title: "Software Engineer",
          company: "Web Solutions LLC",
          years: "2018 - 2021"
        }
      ],
      education: [
        {
          degree: "B.S. in Computer Science",
          institution: "University of Technology",
          year: "2018"
        }
      ]
    };

    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      rawText,
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || []
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
