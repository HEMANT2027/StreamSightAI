import React from 'react';

// Icon for the feature list items
const FeatureCheckIcon = () => (
    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);

// The main Demo page component
const Demo = () => {
    return (
        <main className="relative w-full min-h-screen bg-gray-900 py-28 px-4 overflow-hidden">
            {/* Animated background with a "multiverse" feel */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_38px] animate-pulse"></div>
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_1200px_at_50%_0px,#1e3a8a55,transparent)]"></div>
                <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_1000px_at_80%_100%,#0c4a6e55,transparent)]"></div>
            </div>

            <div className="container mx-auto max-w-5xl text-center">
                <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 tracking-tighter">
                    Interactive Demo
                </h1>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
                    Witness the power of StreamSight AI in action. This video demonstrates how our platform processes, recognizes, and summarizes complex visual data in real-time.
                </p>

                {/* Video Player Section */}
                <div className="relative bg-black/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-700/80 group">
                    {/* A subtle glowing effect on the player */}
                    <div className="absolute -inset-px bg-gradient-to-r from-cyan-400 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                    
                    <div className="relative aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden">
                        {/* Placeholder for the video */}
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-white/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4.018 15.132A1.25 1.25 0 005.25 14.15V5.85a1.25 1.25 0 00-2.007-1.032l-1.5 1.25A1.25 1.25 0 001 7.1v5.8a1.25 1.25 0 00.761 1.152l1.5 1.25a1.25 1.25 0 001.757-.17zM15.982 4.868a1.25 1.25 0 00-1.757-.17l-1.5 1.25A1.25 1.25 0 0012 7.1v5.8a1.25 1.25 0 00.761 1.152l1.5 1.25a1.25 1.25 0 001.757-1.302V5.85a1.25 1.25 0 00-.761-.982z"></path>
                                </svg>
                                <p className="text-white font-semibold">Demo Video Coming Soon</p>
                                <p className="text-gray-400 text-sm">This is where your demo video will be displayed.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Features Highlighted Section */}
                <div className="mt-16 text-left">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">What You'll See</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex items-start space-x-4">
                            <FeatureCheckIcon />
                            <div>
                                <h3 className="text-lg font-semibold text-white">Real-Time Event Recognition</h3>
                                <p className="text-gray-400">Watch as the AI identifies traffic violations and pedestrian movements instantly.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FeatureCheckIcon />
                            <div>
                                <h3 className="text-lg font-semibold text-white">Dynamic Summarization</h3>
                                <p className="text-gray-400">See how hours of footage are condensed into a clear, actionable summary.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FeatureCheckIcon />
                            <div>
                                <h3 className="text-lg font-semibold text-white">Conversational Interaction</h3>
                                <p className="text-gray-400">Observe how users can ask follow-up questions to get deeper insights.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Demo;
