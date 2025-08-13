import React, { useState, useEffect } from 'react';

// Import all the child components
import AnimatedBackground from '../../components/Chatbot/AnimatedBackground';
import InputPanel from '../../components/Chatbot/InputPanel';
import ChatPanel from '../../components/Chatbot/ChatPanel';

// --- Main Chat Page Component ---
// This component assembles the entire chat interface from the imported child components.
const Chat = () => {
    // --- State Management ---
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [messages, setMessages] = useState([
        { text: "Welcome! Please upload a video to begin the analysis.", isUser: false },
    ]);
    const [isBotLoading, setIsBotLoading] = useState(false);

    // Prevent body scrolling when interacting with chat
    useEffect(() => {
        const handleBodyScroll = (e) => {
            // Check if the scroll event is coming from within our chat component
            if (e.target.closest('.chat-container')) {
                e.stopPropagation();
            }
        };

        document.addEventListener('scroll', handleBodyScroll, true);
        return () => document.removeEventListener('scroll', handleBodyScroll, true);
    }, []);

    // --- Simulated Backend Logic ---
    const handleVideoUpload = () => {
        setIsProcessing(true);
        setIsVideoUploaded(false);
        setAnalysisResults(null);
        setMessages([{ text: "Analyzing your video... This may take a moment.", isUser: false }]);

        // Simulate a delay for video processing
        setTimeout(() => {
            const mockResults = {
                summary: "The AI detected a red sedan running a red light at 00:42 and a pedestrian crossing safely at 01:15. Overall traffic flow was moderate with no other major incidents.",
                events: [
                    { type: 'Violation', title: 'Red Light Violation', timestamp: '00:42' },
                    { type: 'Event', title: 'Pedestrian Crossing', timestamp: '01:15' },
                ],
                videoThumbnail: "https://placehold.co/600x400/e2e8f0/4a5568?text=Video+Frame"
            };
            setAnalysisResults(mockResults);
            setIsProcessing(false);
            setIsVideoUploaded(true);
            setMessages([
                { text: "Analysis complete! The summary and key events are now available on the left. Feel free to ask me any questions about the video.", isUser: false }
            ]);
        }, 3000);
    };

    const handleSendMessage = (messageText) => {
        // Add user's message to chat
        setMessages(prev => [...prev, { text: messageText, isUser: true }]);
        setIsBotLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const botResponse = `This is a simulated AI response regarding: "${messageText}"`;
            setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
            setIsBotLoading(false);
        }, 1500);
    };

    return (
        // Added chat-container class and overflow-hidden to prevent unwanted scrolling
        <main className="chat-container relative w-full bg-gray-100 overflow-hidden font-sans pt-24 pb-6">
            <AnimatedBackground />

            {/* Fixed height container to prevent page scrolling */}
            <div className="relative container mx-auto px-4 lg:px-6 h-[calc(100vh-120px)] overflow-hidden">
                <div className="grid lg:grid-cols-12 gap-6 h-full">

                    {/* Left Panel: Video Input and Analysis */}
                    <div className="lg:col-span-5 h-full min-h-0">
                        <InputPanel
                            onVideoUpload={handleVideoUpload}
                            isProcessing={isProcessing}
                            analysisResults={analysisResults}
                        />
                    </div>

                    {/* Right Panel: Chat Interface */}
                    <div className="lg:col-span-7 h-full min-h-0">
                        <ChatPanel
                            isVideoUploaded={isVideoUploaded}
                            messages={messages}
                            isBotLoading={isBotLoading}
                            onSendMessage={handleSendMessage}
                        />
                    </div>

                </div>
            </div>
        </main>
    );
};

export default Chat;