const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const Resume = require('../models/Resume');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const rawText = pdfData.text;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Extract the exact skills array, work experience array (with title, company, years), and education array (with degree, institution, year) from the provided resume text. Return strictly as JSON object with keys: skills, experience, education."
        },
        {
          role: "user",
          content: rawText
        }
      ],
      response_format: { type: "json_object" }
    });

    const parsedData = JSON.parse(completion.choices[0].message.content);

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
