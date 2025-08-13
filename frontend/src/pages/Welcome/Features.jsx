import React from 'react';

// Custom, consistently styled SVG icons for each feature.
const IconWrapper = ({ children }) => (
    <div className="relative w-16 h-16 flex items-center justify-center mb-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-cyan-400/20 shadow-lg shadow-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-50 rounded-2xl"></div>
        <div className="relative z-10">{children}</div>
    </div>
);

const EventRecognitionIcon = () => (
    <IconWrapper>
        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
    </IconWrapper>
);

const SummarizationIcon = () => (
    <IconWrapper>
        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    </IconWrapper>
);

const ConversationalAiIcon = () => (
    <IconWrapper>
        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
    </IconWrapper>
);

const PerformanceIcon = () => (
    <IconWrapper>
        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    </IconWrapper>
);

const ScalabilityIcon = () => (
     <IconWrapper>
        <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
    </IconWrapper>
);


// A reusable card component for displaying features with a hover effect.
const FeatureCard = ({ icon, title, children }) => (
    <div className="relative bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700/60 overflow-hidden transition-all duration-500 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        {icon}
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{children}</p>
    </div>
);


// The main Features page component.
const Features = () => {
    return (
        <main className="relative w-full min-h-screen bg-gray-900 py-28 px-4 overflow-hidden">
            {/* Animated background with a "multiverse" feel */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_58px] animate-pulse"></div>
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_1200px_at_50%_0px,#1e3a8a55,transparent)]"></div>
                <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_1000px_at_80%_100%,#0c4a6e55,transparent)]"></div>
            </div>

            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 tracking-tighter">
                        Core Capabilities
                    </h1>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        These are the foundational features of StreamSight AI, designed to provide a robust and intelligent visual understanding experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    <FeatureCard icon={<EventRecognitionIcon />} title="Event Recognition & Summarization">
                        The system accepts a video stream and identifies specific events, summarizing the content with a focus on guideline adherence and violations.
                    </FeatureCard>
                    <FeatureCard icon={<ConversationalAiIcon />} title="Multi-Turn Conversations">
                        Our agentic chat assistant supports natural, multi-turn interactions, retaining context to provide coherent responses to your follow-up questions.
                    </FeatureCard>
                     <FeatureCard icon={<PerformanceIcon />} title="Initial Video Processing">
                        In its core implementation, the system is built to process input video streams with a maximum duration of 2 minutes, perfect for focused analysis.
                    </FeatureCard>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tighter">
                        Advanced Performance
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                        For demanding, real-world applications, StreamSight AI is optimized for performance and scale, handling high-throughput and long-form content with ease.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <FeatureCard icon={<PerformanceIcon />} title="Low-Latency Processing">
                        Achieves a system latency of less than 1000ms for queries after video input, enabling near real-time analysis and interaction.
                    </FeatureCard>
                    <FeatureCard icon={<ScalabilityIcon />} title="Long-Context & High-Resolution">
                        Processes long-form video streams of up to 120 minutes at a high frame rate of 90fps, built for scalability and intensive workloads.
                    </FeatureCard>
                </div>
            </div>
        </main>
    );
};

export default Features;
