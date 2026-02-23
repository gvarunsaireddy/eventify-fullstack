const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

/**
 * Seed script — populates database with sample data
 * Run: npm run seed
 */

const sampleEvents = [
    {
        title: 'Tech Conference 2026',
        description:
            'Join industry leaders and innovators at the biggest tech conference of the year. Explore cutting-edge technologies, attend workshops, and network with professionals from around the world. Topics include AI, blockchain, cloud computing, and more.',
        date: new Date('2026-04-15'),
        time: '09:00 AM',
        location: 'San Francisco Convention Center, CA',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        capacity: 500,
        price: 99,
    },
    {
        title: 'Startup Pitch Night',
        description:
            'Watch the most promising startups pitch their ideas to a panel of investors and industry experts. Network with founders, VCs, and fellow entrepreneurs. Light refreshments and cocktails will be served.',
        date: new Date('2026-03-20'),
        time: '06:00 PM',
        location: 'WeWork Downtown, New York, NY',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
        capacity: 150,
        price: 25,
    },
    {
        title: 'Summer Music Festival',
        description:
            'Three days of non-stop music featuring top artists from around the globe. Multiple stages, food trucks, art installations, and camping available. All genres from rock to electronic to hip-hop.',
        date: new Date('2026-06-10'),
        time: '12:00 PM',
        location: 'Golden Gate Park, San Francisco, CA',
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
        capacity: 5000,
        price: 150,
    },
    {
        title: 'Modern Art Exhibition',
        description:
            'Experience a curated collection of contemporary art from emerging and established artists. Interactive installations, guided tours, and artist meet-and-greets throughout the day.',
        date: new Date('2026-05-05'),
        time: '10:00 AM',
        location: 'Metropolitan Museum of Art, New York, NY',
        category: 'Art',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80',
        capacity: 200,
        price: 35,
    },
    {
        title: 'Marathon & Fun Run',
        description:
            'Join thousands of runners in this annual marathon and 5K fun run. All fitness levels welcome! Professional timing, medals for all finishers, and a post-race celebration with food and live entertainment.',
        date: new Date('2026-04-25'),
        time: '07:00 AM',
        location: 'Central Park, New York, NY',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&q=80',
        capacity: 2000,
        price: 45,
    },
    {
        title: 'International Food Festival',
        description:
            'Taste your way around the world at our international food festival! Over 50 vendors serving authentic dishes from every continent. Live cooking demonstrations, competitions, and tastings included.',
        date: new Date('2026-05-18'),
        time: '11:00 AM',
        location: 'Pier 39, San Francisco, CA',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        capacity: 1000,
        price: 20,
    },
    {
        title: 'Wellness & Yoga Retreat',
        description:
            'A full-day wellness retreat featuring yoga sessions, meditation workshops, healthy cooking classes, and mindfulness seminars. Suitable for beginners and experienced practitioners alike.',
        date: new Date('2026-07-12'),
        time: '08:00 AM',
        location: 'Malibu Beach Resort, CA',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        capacity: 100,
        price: 75,
    },
    {
        title: 'Web Development Bootcamp',
        description:
            'Intensive one-day coding bootcamp covering React, Node.js, and modern web development practices. Hands-on projects, mentor support, and career guidance included. Laptops required.',
        date: new Date('2026-03-28'),
        time: '09:00 AM',
        location: 'Google Campus, Mountain View, CA',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        capacity: 80,
        price: 0,
    },
    {
        title: 'Professional Networking Mixer',
        description:
            'Expand your professional network at our monthly networking mixer. Meet professionals from diverse industries, exchange ideas, and build meaningful connections. Appetizers and drinks provided.',
        date: new Date('2026-03-15'),
        time: '05:30 PM',
        location: 'Rooftop Lounge, Chicago, IL',
        category: 'Networking',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
        capacity: 120,
        price: 15,
    },
    {
        title: 'AI & Machine Learning Summit',
        description:
            'Deep dive into the latest advancements in artificial intelligence and machine learning. Featuring talks by leading researchers, hands-on workshops with popular frameworks, and a hackathon.',
        date: new Date('2026-08-20'),
        time: '09:00 AM',
        location: 'MIT Media Lab, Cambridge, MA',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        capacity: 300,
        price: 120,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@eventify.com',
            password: 'admin123',
            role: 'admin',
        });
        console.log('👤 Admin created: admin@eventify.com / admin123');

        // Create regular user
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            role: 'user',
        });
        console.log('👤 User created: john@example.com / user123');

        // Create events with admin as organizer
        const events = await Event.insertMany(
            sampleEvents.map((event) => ({ ...event, organizer: admin._id }))
        );
        console.log(`🎉 ${events.length} sample events created`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n--- Login Credentials ---');
        console.log('Admin: admin@eventify.com / admin123');
        console.log('User:  john@example.com / user123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();
