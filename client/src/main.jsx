import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1E293B',
                            color: '#E2E8F0',
                            border: '1px solid rgba(79, 70, 229, 0.3)',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                        },
                        success: {
                            iconTheme: { primary: '#10B981', secondary: '#1E293B' },
                        },
                        error: {
                            iconTheme: { primary: '#EF4444', secondary: '#1E293B' },
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
