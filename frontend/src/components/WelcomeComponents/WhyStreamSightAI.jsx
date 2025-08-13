import React from 'react';

// Custom SVG Icons for each feature card. They are designed to be sleek and modern.
const EventRecognitionIcon = () => (
    <svg className="w-12 h-12 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01"></path>
    </svg>
);

const SummarizationIcon = () => (
    <svg className="w-12 h-12 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
);

const ConversationalAiIcon = () => (
    <svg className="w-12 h-12 mb-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
);

// A reusable card component for displaying features.
const FeatureCard = ({ icon, title, children }) => (
    <div className="relative bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700/80 overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2">
        {/* A subtle glowing effect on hover */}
        <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
        {icon}
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{children}</p>
    </div>
);


// The main "Why StreamSight AI" component.
const WhyStreamSightAI = () => {
  return (
    <section className="relative w-full bg-gray-900 py-20 lg:py-28 px-4 overflow-hidden">
        {/* A futuristic, animated grid background */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_800px_at_50%_200px,#1e3a8a33,transparent)]"></div>
        </div>

        <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tighter">
                The Future of Visual Understanding
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
                Static video players show you what happened. StreamSight AI tells you what it means. We go beyond playback to deliver a truly intelligent, interactive, and insightful visual analysis experience.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<EventRecognitionIcon />}
                    title="Automated Event Recognition"
                >
                    Our AI meticulously scans every frame to identify and flag critical events automatically. From traffic violations to specific human actions, never miss a key moment again.
                </FeatureCard>
                <FeatureCard
                    icon={<SummarizationIcon />}
                    title="Intelligent Summarization"
                >
                    Distill hours of footage into concise, readable summaries. StreamSight AI highlights the most important events, providing you with a clear overview in seconds.
                </FeatureCard>
                <FeatureCard
                    icon={<ConversationalAiIcon />}
                    title="Multi-Turn Conversations"
                >
                    Engage with your video data. Ask follow-up questions, request details about specific events, and get coherent, context-aware answers from our agentic chat assistant.
                </FeatureCard>
            </div>
        </div>
    </section>
  );
};

export default WhyStreamSightAI;
