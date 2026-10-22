const express = require('express');
const router = express.Router();
const { getStats, getLeaderboard } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getStats);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
