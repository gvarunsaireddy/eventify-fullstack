const mongoose = require('mongoose');

/**
 * Event Schema
 * Stores event details, organizer reference, and registered attendees
 */
const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Event description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        date: {
            type: Date,
            required: [true, 'Event date is required'],
        },
        time: {
            type: String,
            required: [true, 'Event time is required'],
        },
        location: {
            type: String,
            required: [true, 'Event location is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Event category is required'],
            enum: [
                'Technology',
                'Business',
                'Music',
                'Art',
                'Sports',
                'Food',
                'Health',
                'Education',
                'Networking',
                'Other',
            ],
        },
        image: {
            type: String,
            default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        },
        capacity: {
            type: Number,
            required: [true, 'Event capacity is required'],
            min: [1, 'Capacity must be at least 1'],
        },
        price: {
            type: Number,
            default: 0,
            min: [0, 'Price cannot be negative'],
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attendees: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                registeredAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Virtual field for number of spots remaining
eventSchema.virtual('spotsLeft').get(function () {
    return this.capacity - this.attendees.length;
});

// Ensure virtuals are included in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
