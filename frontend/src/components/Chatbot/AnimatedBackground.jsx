import React from 'react';

// A dedicated component for the beautiful, animated background.
const AnimatedBackground = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100"></div>
        <div className="absolute top-0 left-0 w-full h-full animate-pulse-slow">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl"></div>
        </div>
        <style jsx>{`
            @keyframes pulse-slow {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }
            .animate-pulse-slow {
                animation: pulse-slow 15s ease-in-out infinite;
            }
        `}</style>
    </div>
);

export default AnimatedBackground;
