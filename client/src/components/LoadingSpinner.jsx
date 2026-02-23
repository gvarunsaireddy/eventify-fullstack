/**
 * LoadingSpinner — full-page centered loading indicator
 */
const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
