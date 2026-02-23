import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

/**
 * NotFound — 404 page
 */
const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center animate-fade-in-up">
                <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn-primary">
                    <HiHome className="text-lg" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
