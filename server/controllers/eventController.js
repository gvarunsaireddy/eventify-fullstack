const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');

/**
 * @desc    Get all events (with optional search & category filter)
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res, next) => {
    try {
        const { search, category, page = 1, limit = 12 } = req.query;
        const query = {};

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .populate('organizer', 'name email')
            .sort({ date: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            data: events,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('attendees.user', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
const createEvent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        // Set organizer to current admin user
        req.body.organizer = req.user._id;

        const event = await Event.create(req.body);
        const populated = await event.populate('organizer', 'name email');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: populated,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
const updateEvent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('organizer', 'name email');

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Remove event from all users' registeredEvents arrays
        await User.updateMany(
            { registeredEvents: event._id },
            { $pull: { registeredEvents: event._id } }
        );

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Register current user for an event
 * @route   POST /api/events/:id/register
 * @access  Private
 */
const registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Check if event is full
        if (event.attendees.length >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'This event is fully booked',
            });
        }

        // Check if user is already registered
        const alreadyRegistered = event.attendees.some(
            (a) => a.user.toString() === req.user._id.toString()
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event',
            });
        }

        // Add user to event attendees
        event.attendees.push({ user: req.user._id });
        await event.save();

        // Add event to user's registeredEvents
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { registeredEvents: event._id },
        });

        res.status(200).json({
            success: true,
            message: 'Successfully registered for the event!',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Unregister current user from an event
 * @route   DELETE /api/events/:id/register
 * @access  Private
 */
const unregisterFromEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Check if user is registered
        const attendeeIndex = event.attendees.findIndex(
            (a) => a.user.toString() === req.user._id.toString()
        );

        if (attendeeIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You are not registered for this event',
            });
        }

        // Remove user from event attendees
        event.attendees.splice(attendeeIndex, 1);
        await event.save();

        // Remove event from user's registeredEvents
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { registeredEvents: event._id },
        });

        res.status(200).json({
            success: true,
            message: 'Successfully unregistered from the event',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get registrations for an event (admin only)
 * @route   GET /api/events/:id/registrations
 * @access  Private/Admin
 */
const getEventRegistrations = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('attendees.user', 'name email')
            .select('title attendees capacity');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                eventTitle: event.title,
                capacity: event.capacity,
                totalRegistrations: event.attendees.length,
                attendees: event.attendees,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user's registered events
 * @route   GET /api/users/my-events
 * @access  Private
 */
const getMyEvents = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'registeredEvents',
            populate: { path: 'organizer', select: 'name email' },
        });

        res.status(200).json({
            success: true,
            data: user.registeredEvents,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    getEventRegistrations,
    getMyEvents,
};
