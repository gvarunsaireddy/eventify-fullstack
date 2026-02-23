import { Link } from 'react-router-dom';
import { HiLightningBolt, HiMail, HiHeart } from 'react-icons/hi';

/**
 * Footer — site footer with links and branding.
 */
const Footer = () => {
    return (
        <footer className="bg-[rgba(15,23,42,0.9)] border-t border-[rgba(79,70,229,0.1)] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 text-xl font-black mb-4">
                            <HiLightningBolt className="text-[#4F46E5] text-2xl" />
                            <span className="gradient-text">Eventify</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            Discover, create, and manage extraordinary events. Connect with like-minded
                            people and create unforgettable experiences.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/events" className="text-gray-400 text-sm hover:text-[#818CF8] transition-colors">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-400 text-sm hover:text-[#818CF8] transition-colors">
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 text-sm hover:text-[#818CF8] transition-colors">
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <HiMail className="text-[#818CF8]" />
                                support@eventify.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[rgba(79,70,229,0.1)] mt-8 pt-8 text-center">
                    <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                        © {new Date().getFullYear()} Eventify. Made with{' '}
                        <HiHeart className="text-[#EF4444] text-base" /> All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
