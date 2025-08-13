import React from 'react';

// A dedicated component for the animated "glitch" background.
const GlitchBackground = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 text-gray-800/5 font-mono text-xs leading-none animate-glitch-text">
            {/* Generating a large block of text/numbers to create the glitch effect */}
            {Array.from({ length: 50 }).map((_, i) => (
                <p key={i}>
                    {`01101001 01101110 01110100 01100101 01101100 01101100 01100101 01111000 01100001 00100000 01100101 01110010 01110010 01101111 01110010 00100000 00110100 00110000 00110100 00100000 01110000 01100001 01100111 01100101 00100000 01101110 01101111 01110100 00100000 01100110 01101111 01110101 01101110 01100100`.repeat(5)}
                </p>
            ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100 opacity-95"></div>
        <style jsx>{`
            @keyframes glitch-text {
                0% { transform: translateY(0) skew(0deg); }
                2% { transform: translateY(-2px) skew(-1deg); }
                4% { transform: translateY(0) skew(0deg); }
                48% { transform: translateY(0) skew(0deg); }
                50% { transform: translateY(3px) skew(2deg) scale(1.01); }
                52% { transform: translateY(0) skew(0deg) scale(1); }
                98% { transform: translateY(0) skew(0deg) scale(1); }
                100% { transform: translateY(-5px) skew(-3deg); }
            }
            .animate-glitch-text {
                animation: glitch-text 10s linear infinite;
            }
        `}</style>
    </div>
);

// The main 404 Not Found page component.
const PageNotFound = () => {
    return (
        <main className="relative w-full min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
            <GlitchBackground />

            <div className="relative z-10">
                <h1 className="text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500 mb-4 animate-pulse">
                    404
                </h1>
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
                    Page Not Found
                </h2>
                <p className="text-md lg:text-lg text-gray-600 max-w-md mx-auto mb-8">
                    It seems you've ventured into an uncharted part of the multiverse. The page you're looking for doesn't exist.
                </p>
                <a 
                    href="/" 
                    className="inline-block px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    Return to Home Base
                </a>
            </div>
        </main>
    );
};

export default PageNotFound;
