const express = require('express');
const { submitAssessment, getMyAssessments, createCustomAssessment, getCustomAssessments } = require('../controllers/assessmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('developer'), submitAssessment);
router.get('/me', protect, authorize('developer'), getMyAssessments);

router.post('/custom', protect, authorize('recruiter'), createCustomAssessment);
router.get('/custom', protect, getCustomAssessments);

module.exports = router;
