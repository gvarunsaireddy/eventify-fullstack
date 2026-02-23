import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiLightningBolt } from 'react-icons/hi';

/**
 * Login Page — email/password form with validation
 */
const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await login(formData.email, formData.password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5] rounded-full opacity-5 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#7C3AED] rounded-full opacity-5 blur-[100px]" />
            </div>

            <div className="glass-card w-full max-w-md p-8 relative animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[rgba(79,70,229,0.15)] mb-4">
                        <HiLightningBolt className="text-2xl text-[#818CF8]" />
                    </div>
                    <h1 className="text-2xl font-black text-white">Welcome Back</h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Sign in to your Eventify account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field !pl-11"
                                placeholder="you@example.com"
                                id="login-email"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field !pl-11"
                                placeholder="••••••••"
                                id="login-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center !py-3.5"
                        id="login-submit"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Demo credentials */}
                <div className="mt-6 p-4 bg-[rgba(79,70,229,0.08)] rounded-xl border border-[rgba(79,70,229,0.15)]">
                    <p className="text-xs font-semibold text-[#818CF8] mb-2">Demo Credentials</p>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                        <div>
                            <p className="font-semibold text-gray-300">Admin</p>
                            <p>admin@eventify.com</p>
                            <p>admin123</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-300">User</p>
                            <p>john@example.com</p>
                            <p>user123</p>
                        </div>
                    </div>
                </div>

                {/* Register link */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-[#818CF8] hover:text-[#A5B4FC] font-semibold transition-colors"
                    >
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
