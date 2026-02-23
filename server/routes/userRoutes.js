const express = require('express');
const { getMyEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/my-events
router.get('/my-events', protect, getMyEvents);

module.exports = router;
