import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiMenu,
    HiX,
    HiLightningBolt,
    HiLogout,
    HiViewGrid,
    HiCalendar,
    HiUser,
} from 'react-icons/hi';

/**
 * Navbar — responsive navigation with auth-aware links.
 * Shows different options based on login state and user role.
 */
const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
            ? 'text-white bg-[rgba(79,70,229,0.2)]'
            : 'text-gray-400 hover:text-white hover:bg-[rgba(79,70,229,0.1)]'
        }`;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,23,42,0.85)] backdrop-blur-xl border-b border-[rgba(79,70,229,0.15)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-black"
                        onClick={() => setMobileOpen(false)}
                    >
                        <HiLightningBolt className="text-[#4F46E5] text-2xl" />
                        <span className="gradient-text">Eventify</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/" className={navLinkClass('/')}>
                            Home
                        </Link>
                        <Link to="/events" className={navLinkClass('/events')}>
                            <HiCalendar className="text-lg" />
                            Events
                        </Link>

                        {isAuthenticated && !isAdmin && (
                            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                <HiViewGrid className="text-lg" />
                                My Events
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className={navLinkClass('/admin')}>
                                <HiViewGrid className="text-lg" />
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(79,70,229,0.1)] rounded-lg border border-[rgba(79,70,229,0.2)]">
                                    <HiUser className="text-[#818CF8]" />
                                    <span className="text-sm text-gray-300 font-medium">
                                        {user?.name}
                                    </span>
                                    {isAdmin && (
                                        <span className="text-[10px] bg-[#4F46E5] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[rgba(239,68,68,0.1)]"
                                >
                                    <HiLogout className="text-lg" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary text-sm !py-2 !px-5">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors p-2"
                        id="mobile-menu-toggle"
                    >
                        {mobileOpen ? (
                            <HiX className="text-2xl" />
                        ) : (
                            <HiMenu className="text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[rgba(15,23,42,0.98)] backdrop-blur-xl border-t border-[rgba(79,70,229,0.15)] animate-fade-in">
                    <div className="px-4 py-4 space-y-2">
                        <Link
                            to="/"
                            className={navLinkClass('/')}
                            onClick={() => setMobileOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/events"
                            className={navLinkClass('/events')}
                            onClick={() => setMobileOpen(false)}
                        >
                            <HiCalendar className="text-lg" />
                            Events
                        </Link>

                        {isAuthenticated && !isAdmin && (
                            <Link
                                to="/dashboard"
                                className={navLinkClass('/dashboard')}
                                onClick={() => setMobileOpen(false)}
                            >
                                <HiViewGrid className="text-lg" />
                                My Events
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={navLinkClass('/admin')}
                                onClick={() => setMobileOpen(false)}
                            >
                                <HiViewGrid className="text-lg" />
                                Dashboard
                            </Link>
                        )}

                        <hr className="border-[rgba(79,70,229,0.15)] my-3" />

                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-2 text-gray-300">
                                    <HiUser className="text-[#818CF8]" />
                                    <span className="text-sm font-medium">{user?.name}</span>
                                    {isAdmin && (
                                        <span className="text-[10px] bg-[#4F46E5] text-white px-2 py-0.5 rounded-full font-bold">
                                            ADMIN
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"
                                >
                                    <HiLogout className="text-lg" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-[rgba(79,70,229,0.1)]"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary w-full justify-center text-sm !py-2.5"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
