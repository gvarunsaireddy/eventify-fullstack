const express = require('express');
const { body } = require('express-validator');
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    getEventRegistrations,
    getMyEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// Validation rules for creating/updating events
const eventValidation = [
    body('title').trim().notEmpty().withMessage('Event title is required'),
    body('description').trim().notEmpty().withMessage('Event description is required'),
    body('date').notEmpty().withMessage('Event date is required'),
    body('time').trim().notEmpty().withMessage('Event time is required'),
    body('location').trim().notEmpty().withMessage('Event location is required'),
    body('category').notEmpty().withMessage('Event category is required'),
    body('capacity')
        .isInt({ min: 1 })
        .withMessage('Capacity must be at least 1'),
];

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Authenticated user routes
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, unregisterFromEvent);

// Admin-only routes
router.post('/', protect, authorize('admin'), eventValidation, createEvent);
router.put('/:id', protect, authorize('admin'), eventValidation, updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.get('/:id/registrations', protect, authorize('admin'), getEventRegistrations);

module.exports = router;
