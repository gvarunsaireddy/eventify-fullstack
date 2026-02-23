import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiArrowRight,
    HiCalendar,
    HiUsers,
    HiLightningBolt,
    HiGlobe,
    HiStar,
    HiShieldCheck,
} from 'react-icons/hi';
import api from '../services/api';
import EventCard from '../components/EventCard';

/**
 * Landing Page — hero section, featured events, stats, and CTA
 */
const Landing = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/events?limit=6');
                setFeaturedEvents(res.data.data);
            } catch {
                // Silently handle — events just won't show
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const stats = [
        { icon: HiCalendar, value: '500+', label: 'Events Hosted' },
        { icon: HiUsers, value: '10K+', label: 'Attendees' },
        { icon: HiGlobe, value: '50+', label: 'Cities' },
        { icon: HiStar, value: '4.9', label: 'Avg Rating' },
    ];

    const features = [
        {
            icon: HiLightningBolt,
            title: 'Easy Registration',
            desc: 'Sign up for events in seconds with our streamlined registration process.',
        },
        {
            icon: HiShieldCheck,
            title: 'Secure & Reliable',
            desc: 'Enterprise-grade security with JWT authentication and encrypted data.',
        },
        {
            icon: HiCalendar,
            title: 'Event Management',
            desc: 'Create, manage, and track events with our powerful admin dashboard.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* ===== Hero Section ===== */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#4F46E5] rounded-full opacity-10 blur-[100px] animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7C3AED] rounded-full opacity-10 blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06B6D4] rounded-full opacity-5 blur-[150px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left side — Text */}
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-[rgba(79,70,229,0.15)] text-[#818CF8] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[rgba(79,70,229,0.2)]">
                                <HiLightningBolt />
                                #1 Event Platform
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                Discover
                                <span className="gradient-text"> Amazing </span>
                                Events Near You
                            </h1>
                            <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                                Explore conferences, workshops, concerts, and meetups. Connect with
                                passionate communities and create unforgettable experiences.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/events" className="btn-primary text-base !py-3.5 !px-8">
                                    Explore Events
                                    <HiArrowRight className="text-lg" />
                                </Link>
                                <Link to="/register" className="btn-secondary text-base !py-3.5 !px-8">
                                    Join Free
                                </Link>
                            </div>
                        </div>

                        {/* Right side — Decorative card stack */}
                        <div className="hidden md:block relative animate-fade-in-up delay-200">
                            <div className="relative">
                                {/* Main card */}
                                <div className="glass-card p-6 animate-float">
                                    <img
                                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
                                        alt="Event"
                                        className="w-full h-64 object-cover rounded-xl mb-4"
                                    />
                                    <h3 className="text-white font-bold text-lg">Tech Conference 2026</h3>
                                    <p className="text-gray-400 text-sm mt-1">San Francisco, CA</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="badge badge-technology">Technology</span>
                                        <span className="text-[#10B981] text-sm font-semibold">
                                            500 spots left
                                        </span>
                                    </div>
                                </div>

                                {/* Floating notification */}
                                <div className="absolute -top-4 -right-4 glass-card p-3 animate-pulse-glow">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
                                            <HiUsers className="text-white text-sm" />
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-bold">+124</p>
                                            <p className="text-gray-400 text-[10px]">Registered today</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== Stats Bar ===== */}
            <section className="relative border-y border-[rgba(79,70,229,0.1)] bg-[rgba(30,41,59,0.3)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div
                                key={i}
                                className={`text-center animate-fade-in-up delay-${(i + 1) * 100}`}
                            >
                                <stat.icon className="text-3xl text-[#4F46E5] mx-auto mb-2" />
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Featured Events ===== */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                            Upcoming <span className="gradient-text">Events</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Don't miss out on these incredible events happening near you
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass-card overflow-hidden">
                                    <div className="skeleton h-48 w-full" />
                                    <div className="p-5 space-y-3">
                                        <div className="skeleton h-5 w-3/4" />
                                        <div className="skeleton h-4 w-full" />
                                        <div className="skeleton h-4 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredEvents.map((event, i) => (
                                <div
                                    key={event._id}
                                    className={`animate-fade-in-up delay-${(i % 3 + 1) * 100}`}
                                >
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/events" className="btn-primary text-base !py-3 !px-8">
                            View All Events
                            <HiArrowRight className="text-lg" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== Features Section ===== */}
            <section className="py-20 bg-[rgba(30,41,59,0.2)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                            Why Choose <span className="gradient-text">Eventify</span>?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className={`glass-card p-8 text-center animate-fade-in-up delay-${(i + 1) * 100}`}
                            >
                                <div className="w-14 h-14 rounded-xl bg-[rgba(79,70,229,0.15)] flex items-center justify-center mx-auto mb-5">
                                    <feature.icon className="text-2xl text-[#818CF8]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA Section ===== */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass-card p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(79,70,229,0.1)] to-[rgba(124,58,237,0.1)]" />
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Join thousands of event enthusiasts. Create your free account and start
                                discovering amazing events today.
                            </p>
                            <Link to="/register" className="btn-primary text-base !py-3.5 !px-10">
                                Create Free Account
                                <HiArrowRight className="text-lg" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
