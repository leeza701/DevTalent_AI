const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getStats);

module.exports = router;
