import { useState, useEffect } from 'react';
import { HiSearch, HiFilter } from 'react-icons/hi';
import api from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = [
    'All',
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
];

/**
 * Events Page — browse all events with search and category filter
 */
const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        fetchEvents();
    }, [category]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (category !== 'All') params.category = category;
            if (search) params.search = search;
            const res = await api.get('/events', { params });
            setEvents(res.data.data);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
                        Explore <span className="gradient-text">Events</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Find the perfect event for you — from tech conferences to food festivals
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="glass-card p-4 sm:p-6 mb-8 animate-fade-in-up delay-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="input-field !pl-11 !pr-24"
                                id="event-search"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2 !px-4 !text-sm"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                        <HiFilter className="text-gray-500 flex-shrink-0" />
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${category === cat
                                        ? 'bg-[#4F46E5] text-white'
                                        : 'bg-[rgba(79,70,229,0.1)] text-gray-400 hover:bg-[rgba(79,70,229,0.2)] hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <LoadingSpinner />
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, i) => (
                            <div
                                key={event._id}
                                className={`animate-fade-in-up delay-${((i % 3) + 1) * 100}`}
                            >
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
                        <p className="text-gray-400">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
