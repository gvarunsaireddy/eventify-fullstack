import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiCalendar,
    HiLocationMarker,
    HiTicket,
    HiExternalLink,
} from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * UserDashboard — displays the user's registered events
 */
const UserDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const res = await api.get('/users/my-events');
            setEvents(res.data.data);
        } catch {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl font-black text-white mb-2">
                        Welcome, <span className="gradient-text">{user?.name}</span>
                    </h1>
                    <p className="text-gray-400">Manage your event registrations</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-100">
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                                <HiTicket className="text-xl text-[#818CF8]" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">{events.length}</p>
                                <p className="text-xs text-gray-400">Registered Events</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                                <HiCalendar className="text-xl text-[#10B981]" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">
                                    {events.filter((e) => new Date(e.date) > new Date()).length}
                                </p>
                                <p className="text-xs text-gray-400">Upcoming</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[rgba(249,115,22,0.15)] flex items-center justify-center">
                                <HiCalendar className="text-xl text-[#F97316]" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">
                                    {events.filter((e) => new Date(e.date) <= new Date()).length}
                                </p>
                                <p className="text-xs text-gray-400">Past Events</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="animate-fade-in-up delay-200">
                    <h2 className="text-xl font-bold text-white mb-4">My Registered Events</h2>

                    {events.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <div className="text-6xl mb-4">🎟️</div>
                            <h3 className="text-xl font-bold text-white mb-2">No Events Yet</h3>
                            <p className="text-gray-400 mb-6">
                                You haven't registered for any events yet. Browse our events to get started!
                            </p>
                            <Link to="/events" className="btn-primary">
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div
                                    key={event._id}
                                    className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                >
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full sm:w-24 h-24 object-cover rounded-xl flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-lg truncate">
                                            {event.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <HiCalendar className="text-[#818CF8]" />
                                                {formatDate(event.date)} • {event.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <HiLocationMarker className="text-[#F97316]" />
                                                {event.location}
                                            </span>
                                        </div>
                                        <span
                                            className={`badge badge-${event.category?.toLowerCase() || 'other'} mt-2 inline-block`}
                                        >
                                            {event.category}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="btn-secondary !py-2 !px-4 !text-sm flex-shrink-0"
                                    >
                                        <HiExternalLink />
                                        View
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
