const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createJob)
  .get(protect, getJobs);

module.exports = router;
