import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

// A component to generate the raining lines effect.
// It creates multiple 'drops' with randomized positions and animation delays.
const RainEffect = () => {


    // Increase or decrease count for more or less rain
    const dropCount = 12;

    return (
        <div aria-hidden="true" className="absolute inset-0 w-full h-full overflow-hidden -z-0">
            {Array.from({ length: dropCount }).map((_, i) => (
                <div
                    key={i}
                    className="rain-line"
                    style={{
                        left: `${Math.random() * 100}%`, // Random horizontal position
                        animationDuration: `${0.5 + Math.random() * 0.5}s`, // Random speed
                        animationDelay: `${Math.random() * 5}s`, // Random start time
                    }}
                />
            ))}
        </div>
    );
};


// A new, more sophisticated visual component for the hero section.
// It represents AI analyzing video frames and extracting data points.
const AiVisionGraphic = () => (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
        {/* A subtle, glowing background effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full blur-xl opacity-50 animate-pulse"></div>

        <div className="relative bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-200/80">
            <div className="aspect-w-1 aspect-h-1 bg-gray-900/80 rounded-full overflow-hidden relative flex items-center justify-center">

                {/* Concentric, rotating rings to represent scanning/processing */}
                <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute h-full w-full border-2 border-dashed border-blue-400/30 rounded-full"></div>
                    <div className="absolute inset-4 h-auto w-auto border-2 border-dashed border-cyan-400/30 rounded-full animate-spin-slower-reverse"></div>
                </div>

                {/* Central "eye" icon */}
                <svg className="w-16 h-16 text-white/90 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>

                {/* Floating data points being analyzed */}
                <div className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-lg animate-float" style={{ top: '15%', left: '50%' }}></div>
                <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-lg animate-float" style={{ top: '40%', left: '15%', animationDelay: '1s' }}></div>
                <div className="absolute w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-lg animate-float" style={{ top: '75%', left: '25%', animationDelay: '0.5s' }}></div>
                <div className="absolute w-2 h-2 bg-indigo-500 rounded-full shadow-lg animate-float" style={{ top: '55%', left: '85%', animationDelay: '1.5s' }}></div>
                <div className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-lg animate-float" style={{ top: '80%', left: '70%', animationDelay: '0.2s' }}></div>
            </div>
        </div>

        <style jsx>{`
            /* --- Existing Animations --- */
            @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
                animation: spin-slow 20s linear infinite;
            }
            @keyframes spin-slower-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
            }
            .animate-spin-slower-reverse {
                animation: spin-slower-reverse 30s linear infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
                50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
            }
            .animate-float {
                animation: float 6s ease-in-out infinite;
            }

            /* --- ✨ New Rain Animation ✨ --- */
            .rain-line {
                position: absolute;
                top: -150px; /* Start off-screen */
                width: 1.5px;
                height: 100px;
                background: linear-gradient(to bottom, rgba(239, 68, 68, 0), rgba(220, 38, 38, 0.7));
                animation-name: fall;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
            @keyframes fall {
                from {
                    transform: translateY(0vh);
                }
                to {
                    transform: translateY(110vh); /* End off-screen */
                }
            }
        `}</style>
    </div>
);


// The main Hero component for the application, now with a new layout.
const Hero = () => {
    const navigate = useNavigate();
    const handleViewDemo = () => {
        navigate("/demo");
    }

    const handleStart = () => {
        navigate("/chat")
    }

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-24">
            {/* Animated gradient background, more subtle */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d1d5db,transparent)] opacity-40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_80%,#c7d2fe,transparent)] opacity-50"></div>
            </div>

            {/* ✨ ADDED: Raining Lines Effect Component ✨ */}
            <RainEffect />

            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 items-center gap-x-12 gap-y-16">
                    {/* The new visual graphic is now on the left */}
                    <div className="flex justify-center">
                        <AiVisionGraphic />
                    </div>

                    {/* The text content is now on the right */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tighter">
                            <Typewriter
                                options={{
                                    strings: [
                                        'See Beyond the Pixels.',
                                        'Understand the Action.',
                                        'Unlock Visual Insights.',
                                        'Transform Video into Data.'
                                    ],
                                    autoStart: true,
                                    loop: true,
                                    delay: 50,
                                    deleteSpeed: 50,
                                }}
                            />
                            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-sky-500">
                                With StreamSight AI.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                            StreamSight AI is an advanced agentic assistant that deciphers complex video streams. It identifies key events, summarizes content, and enables multi-turn conversations to unlock critical insights from visual data.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button onClick={handleStart} className="group w-full sm:w-auto flex items-center justify-center px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Start Your Analysis
                            </button>
                            <button onClick={handleViewDemo} className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-indigo-600 bg-white/70 backdrop-blur-sm border-2 border-indigo-200/80 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300">
                                View Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;