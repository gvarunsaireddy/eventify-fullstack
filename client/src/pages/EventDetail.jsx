import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    HiCalendar,
    HiLocationMarker,
    HiUsers,
    HiClock,
    HiCurrencyDollar,
    HiArrowLeft,
    HiCheckCircle,
} from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * EventDetail Page — shows full event info with registration
 */
const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data.data);
            // Check if current user is registered
            if (user) {
                const registered = res.data.data.attendees?.some(
                    (a) => a.user?._id === user.id || a.user === user.id
                );
                setIsRegistered(registered);
            }
        } catch {
            toast.error('Event not found');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to register for events');
            navigate('/login');
            return;
        }

        setRegistering(true);
        try {
            await api.post(`/events/${id}/register`);
            toast.success('Successfully registered for the event!');
            setIsRegistered(true);
            fetchEvent(); // Refresh data
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregister = async () => {
        setRegistering(true);
        try {
            await api.delete(`/events/${id}/register`);
            toast.success('Successfully unregistered from the event');
            setIsRegistered(false);
            fetchEvent();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to unregister');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!event) return null;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const spotsLeft = event.capacity - (event.attendees?.length || 0);
    const categoryClass = `badge badge-${event.category?.toLowerCase() || 'other'}`;

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <HiArrowLeft /> Back to Events
                </Link>

                <div className="glass-card overflow-hidden animate-fade-in-up">
                    {/* Event Image */}
                    <div className="relative h-64 sm:h-80 lg:h-96">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[rgba(15,23,42,0.3)] to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className={categoryClass}>{event.category}</span>
                            <h1 className="text-2xl sm:text-4xl font-black text-white mt-3">
                                {event.title}
                            </h1>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 sm:p-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-bold text-white mb-4">About This Event</h2>
                                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>

                                {/* Organizer */}
                                {event.organizer && (
                                    <div className="mt-8 p-4 bg-[rgba(79,70,229,0.08)] rounded-xl border border-[rgba(79,70,229,0.15)]">
                                        <p className="text-xs font-semibold text-[#818CF8] mb-1">
                                            Organized by
                                        </p>
                                        <p className="text-white font-semibold">{event.organizer.name}</p>
                                        <p className="text-gray-400 text-sm">{event.organizer.email}</p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Card */}
                            <div className="lg:col-span-1">
                                <div className="glass-card p-6 sticky top-24">
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                                                <HiCalendar className="text-[#818CF8]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-white text-sm font-medium">
                                                    {formatDate(event.date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[rgba(249,115,22,0.15)] flex items-center justify-center">
                                                <HiClock className="text-[#F97316]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Time</p>
                                                <p className="text-white text-sm font-medium">{event.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                                                <HiLocationMarker className="text-[#10B981]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Location</p>
                                                <p className="text-white text-sm font-medium">{event.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                                <HiCurrencyDollar className="text-[#06B6D4]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="text-white text-sm font-medium">
                                                    {event.price > 0 ? `$${event.price}` : 'Free'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[rgba(244,114,182,0.15)] flex items-center justify-center">
                                                <HiUsers className="text-[#F472B6]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Capacity</p>
                                                <p className="text-white text-sm font-medium">
                                                    {event.attendees?.length || 0} / {event.capacity}
                                                    <span className="text-gray-400 ml-1">
                                                        ({spotsLeft} left)
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Registration Button */}
                                    {isRegistered ? (
                                        <div>
                                            <div className="flex items-center gap-2 text-[#10B981] mb-3 p-3 bg-[rgba(16,185,129,0.1)] rounded-lg">
                                                <HiCheckCircle className="text-xl" />
                                                <span className="font-semibold text-sm">You're registered!</span>
                                            </div>
                                            <button
                                                onClick={handleUnregister}
                                                disabled={registering}
                                                className="btn-danger w-full justify-center"
                                            >
                                                {registering ? 'Processing...' : 'Cancel Registration'}
                                            </button>
                                        </div>
                                    ) : spotsLeft > 0 ? (
                                        <button
                                            onClick={handleRegister}
                                            disabled={registering}
                                            className="btn-primary w-full justify-center !py-3.5"
                                            id="register-for-event"
                                        >
                                            {registering ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                'Register for Event'
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full py-3.5 rounded-xl bg-gray-700 text-gray-400 font-semibold cursor-not-allowed"
                                        >
                                            Sold Out
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
