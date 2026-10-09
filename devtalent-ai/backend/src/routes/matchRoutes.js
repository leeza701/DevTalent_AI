const express = require('express');
const { getMatchesForJob } = require('../controllers/matchController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/:jobId')
  .get(protect, getMatchesForJob);

module.exports = router;
