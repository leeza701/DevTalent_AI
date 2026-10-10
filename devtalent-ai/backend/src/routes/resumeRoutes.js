const express = require('express');
const multer = require('multer');
const { uploadResume, getMyResumes, getAllCandidates } = require('../controllers/resumeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, authorize('developer'), upload.single('resume'), uploadResume);
router.get('/me', protect, authorize('developer'), getMyResumes);
router.get('/all', protect, authorize('recruiter'), getAllCandidates);

module.exports = router;
