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

    // LIVE AI ENGINE INTEGRATION
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const prompt = `
      You are an expert technical recruiter AI. Please analyze the following resume text and extract the key information.
      Return the output strictly as a valid JSON object with the following exact structure:
      {
        "skills": ["Array of technical skills and tools found"],
        "experience": [
          { "title": "Job Title", "company": "Company Name", "years": "Duration (e.g. 2018 - 2021)" }
        ],
        "education": [
          { "degree": "Degree Name", "institution": "School/University", "year": "Graduation Year" }
        ]
      }
      Do not include markdown blocks like \`\`\`json or any other text before/after it, just return the raw JSON object string.

      RESUME TEXT:
      ${rawText}
    `;

    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text();
    
    // Clean potential markdown blocks attached by Gemini
    if (aiResponse.includes('\`\`\`json')) {
      aiResponse = aiResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    let parsedData = { skills: [], experience: [], education: [] };
    try {
      parsedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", parseError);
    }

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
    const resumes = await Resume.find({ user: req.user.id }).sort('-processedAt');
    res.status(200).json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    // Populate the user field to get developer names and emails, but only fetch latest resumes realistically
    // For simplicity, we just fetch all parsed resumes
    const candidates = await Resume.find().populate('user', 'name email').sort('-processedAt');
    res.status(200).json({ success: true, count: candidates.length, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
