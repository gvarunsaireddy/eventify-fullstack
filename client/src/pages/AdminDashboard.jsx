import { useState, useEffect } from 'react';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiCalendar,
    HiUsers,
    HiX,
    HiEye,
    HiChevronDown,
    HiChevronUp,
} from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = [
    'Technology', 'Business', 'Music', 'Art', 'Sports',
    'Food', 'Health', 'Education', 'Networking', 'Other',
];

const emptyForm = {
    title: '', description: '', date: '', time: '', location: '',
    category: 'Technology', image: '', capacity: 100, price: 0,
};

/**
 * AdminDashboard — create, edit, delete events, and view registrations
 */
const AdminDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [expandedRegistrations, setExpandedRegistrations] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegs, setLoadingRegs] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events?limit=100');
            setEvents(res.data.data);
        } catch {
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'capacity' || name === 'price' ? Number(value) : value,
        }));
    };

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEdit = (event) => {
        setEditingId(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date?.split('T')[0] || '',
            time: event.time,
            location: event.location,
            category: event.category,
            image: event.image,
            capacity: event.capacity,
            price: event.price || 0,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/events/${editingId}`, formData);
                toast.success('Event updated successfully!');
            } else {
                await api.post('/events', formData);
                toast.success('Event created successfully!');
            }
            setShowModal(false);
            fetchEvents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/events/${id}`);
            toast.success('Event deleted');
            fetchEvents();
        } catch {
            toast.error('Failed to delete event');
        }
    };

    const toggleRegistrations = async (eventId) => {
        if (expandedRegistrations === eventId) {
            setExpandedRegistrations(null);
            return;
        }
        setLoadingRegs(true);
        setExpandedRegistrations(eventId);
        try {
            const res = await api.get(`/events/${eventId}/registrations`);
            setRegistrations(res.data.data.attendees);
        } catch {
            toast.error('Failed to load registrations');
            setRegistrations([]);
        } finally {
            setLoadingRegs(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">
                            Admin <span className="gradient-text">Dashboard</span>
                        </h1>
                        <p className="text-gray-400">
                            Welcome, {user?.name} — Manage all events
                        </p>
                    </div>
                    <button onClick={openCreate} className="btn-primary" id="create-event-btn">
                        <HiPlus className="text-lg" />
                        Create Event
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-100">
                    <div className="glass-card p-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                            <HiCalendar className="text-xl text-[#818CF8]" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{events.length}</p>
                            <p className="text-xs text-gray-400">Total Events</p>
                        </div>
                    </div>
                    <div className="glass-card p-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                            <HiUsers className="text-xl text-[#10B981]" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">
                                {events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-400">Total Registrations</p>
                        </div>
                    </div>
                    <div className="glass-card p-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(249,115,22,0.15)] flex items-center justify-center">
                            <HiCalendar className="text-xl text-[#F97316]" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">
                                {events.filter((e) => new Date(e.date) > new Date()).length}
                            </p>
                            <p className="text-xs text-gray-400">Upcoming</p>
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="glass-card overflow-hidden animate-fade-in-up delay-200">
                    <div className="p-5 border-b border-[rgba(79,70,229,0.1)]">
                        <h2 className="text-lg font-bold text-white">All Events</h2>
                    </div>

                    {events.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-lg font-bold text-white mb-2">No Events Yet</h3>
                            <p className="text-gray-400 mb-4">Create your first event to get started</p>
                            <button onClick={openCreate} className="btn-primary">
                                <HiPlus /> Create Event
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[rgba(79,70,229,0.1)]">
                                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                            Date
                                        </th>
                                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                            Category
                                        </th>
                                        <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Attendees
                                        </th>
                                        <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <>
                                            <tr
                                                key={event._id}
                                                className="border-b border-[rgba(79,70,229,0.05)] hover:bg-[rgba(79,70,229,0.05)] transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-white font-semibold text-sm truncate max-w-[200px]">
                                                                {event.title}
                                                            </p>
                                                            <p className="text-gray-500 text-xs truncate max-w-[200px]">
                                                                {event.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 hidden md:table-cell">
                                                    <p className="text-gray-300 text-sm">{formatDate(event.date)}</p>
                                                    <p className="text-gray-500 text-xs">{event.time}</p>
                                                </td>
                                                <td className="p-4 hidden lg:table-cell">
                                                    <span className={`badge badge-${event.category?.toLowerCase()}`}>
                                                        {event.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {event.attendees?.length || 0}
                                                    </span>
                                                    <span className="text-gray-500 text-xs"> / {event.capacity}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => toggleRegistrations(event._id)}
                                                            className="p-2 rounded-lg hover:bg-[rgba(16,185,129,0.1)] text-[#10B981] transition-colors"
                                                            title="View Registrations"
                                                        >
                                                            {expandedRegistrations === event._id ? (
                                                                <HiChevronUp className="text-lg" />
                                                            ) : (
                                                                <HiEye className="text-lg" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => openEdit(event)}
                                                            className="p-2 rounded-lg hover:bg-[rgba(79,70,229,0.1)] text-[#818CF8] transition-colors"
                                                            title="Edit"
                                                        >
                                                            <HiPencil className="text-lg" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(event._id, event.title)}
                                                            className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-[#EF4444] transition-colors"
                                                            title="Delete"
                                                        >
                                                            <HiTrash className="text-lg" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Registrations Dropdown */}
                                            {expandedRegistrations === event._id && (
                                                <tr key={`reg-${event._id}`}>
                                                    <td colSpan={5} className="bg-[rgba(79,70,229,0.03)] p-4">
                                                        {loadingRegs ? (
                                                            <p className="text-gray-400 text-sm text-center py-2">Loading...</p>
                                                        ) : registrations.length === 0 ? (
                                                            <p className="text-gray-400 text-sm text-center py-2">
                                                                No registrations yet
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-semibold text-[#818CF8] mb-2">
                                                                    Registered Attendees ({registrations.length})
                                                                </p>
                                                                {registrations.map((att, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="flex items-center gap-3 p-2 rounded-lg bg-[rgba(30,41,59,0.5)]"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-full bg-[rgba(79,70,229,0.2)] flex items-center justify-center text-[#818CF8] text-xs font-bold">
                                                                            {att.user?.name?.charAt(0) || '?'}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-white text-sm font-medium">
                                                                                {att.user?.name || 'Unknown User'}
                                                                            </p>
                                                                            <p className="text-gray-500 text-xs">
                                                                                {att.user?.email || ''}
                                                                            </p>
                                                                        </div>
                                                                        <p className="ml-auto text-gray-500 text-xs">
                                                                            {new Date(att.registeredAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] text-gray-400 hover:text-white transition-colors"
                            >
                                <HiX className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                    <input
                                        name="title" value={formData.title} onChange={handleChange}
                                        required className="input-field" placeholder="Event title"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                    <textarea
                                        name="description" value={formData.description} onChange={handleChange}
                                        required className="input-field min-h-[100px] resize-y" placeholder="Describe the event..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                                    <input
                                        type="date" name="date" value={formData.date} onChange={handleChange}
                                        required className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                                    <input
                                        name="time" value={formData.time} onChange={handleChange}
                                        required className="input-field" placeholder="e.g., 09:00 AM"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                    <input
                                        name="location" value={formData.location} onChange={handleChange}
                                        required className="input-field" placeholder="Event venue and city"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        name="category" value={formData.category} onChange={handleChange}
                                        className="input-field"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                                    <input
                                        type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                                        required min="1" className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
                                    <input
                                        type="number" name="price" value={formData.price} onChange={handleChange}
                                        min="0" step="0.01" className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                                    <input
                                        name="image" value={formData.image} onChange={handleChange}
                                        className="input-field" placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : editingId ? (
                                        'Update Event'
                                    ) : (
                                        'Create Event'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
