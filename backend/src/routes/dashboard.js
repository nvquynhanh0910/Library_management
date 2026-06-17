const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboard } = require('../controller/dashboardController');

// GET /api/dashboard
router.get('/', protect, getDashboard);

module.exports = router;