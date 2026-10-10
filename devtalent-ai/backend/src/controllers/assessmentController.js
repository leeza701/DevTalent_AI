const Assessment = require('../models/Assessment');
const CustomAssessment = require('../models/CustomAssessment');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.submitAssessment = async (req, res) => {
  try {
    const { topic, code, score: mockScore } = req.body;
    
    let finalScore = mockScore;

    // AI Grader intercepts code submission if code exists
    if (code) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
      
      const prompt = `You are a strict, senior staff engineer AI evaluator. 
      The candidate has submitted code for a technical topic: "${topic}".
      Below is their code block. Evaluate it strictly on Time Complexity, Space Complexity, Optimization, and syntax readability. 
      Return ONLY an integer between 0 and 100 representing their strict score. Do not output anything else. No text, no markdown. Just the integer.
      
      Code:
      ${code}`;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      // Extract first matching integer block just in case Gemini accidentally adds a space or newline
      const match = aiResponse.match(/\d+/);
      finalScore = match ? parseInt(match[0], 10) : 50; 
      finalScore = Math.min(100, Math.max(0, finalScore)); // Ensure bounds
    }

    if (!topic || finalScore === undefined) {
      return res.status(400).json({ success: false, error: 'Topic and score evaluation failed' });
    }

    const assessment = await Assessment.create({
      user: req.user.id,
      topic,
      score: finalScore
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort('-completedAt');
    res.status(200).json({ success: true, count: assessments.length, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCustomAssessment = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const colors = ['blue', 'indigo', 'purple', 'emerald', 'sky', 'rose'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const custom = await CustomAssessment.create({
      title,
      description,
      duration,
      color: randomColor,
      recruiter: req.user.id
    });
    res.status(201).json({ success: true, data: custom });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCustomAssessments = async (req, res) => {
  try {
    const tests = await CustomAssessment.find().sort('-createdAt');
    res.status(200).json({ success: true, count: tests.length, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
