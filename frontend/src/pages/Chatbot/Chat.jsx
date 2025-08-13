// chat.jsx
import React, { useState, useEffect } from 'react';
import AnimatedBackground from '../../components/Chatbot/AnimatedBackground';
import InputPanel from '../../components/Chatbot/InputPanel';
import ChatPanel from '../../components/Chatbot/ChatPanel';
import { sendMessage } from '../../utils/api'; // import your API call

const Chat = () => {
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [messages, setMessages] = useState([
        { text: "Welcome! Please upload a video to begin the analysis.", isUser: false },
    ]);
    const [isBotLoading, setIsBotLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null); // for maintaining conversation context

    // Handle video + prompt upload
    const handleVideoUpload = async ({ file, prompt }) => {
        setIsProcessing(true);
        setMessages([{ text: "Analyzing your video... This may take a moment.", isUser: false }]);

        try {
            const result = await sendMessage(prompt || "Analyze this video", file, sessionId);
            setSessionId(result.sessionId); // store for later chat
            setAnalysisResults(result.response); // assuming backend sends structured analysis
            setIsVideoUploaded(true);

            setMessages(prev => [
                ...prev,
                { text: "Analysis complete! You can now chat about the video.", isUser: false }
            ]);
        } catch (error) {
            setMessages([{ text: `Error: ${error.message}`, isUser: false }]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle text chat
    const handleSendMessage = async (messageText) => {
        setMessages(prev => [...prev, { text: messageText, isUser: true }]);
        setIsBotLoading(true);

        try {
            const result = await sendMessage(messageText, null, sessionId);
            setMessages(prev => [...prev, { text: result.response, isUser: false }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: `Error: ${error.message}`, isUser: false }]);
        } finally {
            setIsBotLoading(false);
        }
    };

    return (
        <main className="chat-container relative w-full bg-gray-100 overflow-hidden font-sans pt-24 pb-6">
            <AnimatedBackground />
            <div className="relative container mx-auto px-4 lg:px-6 h-[calc(100vh-120px)] overflow-hidden">
                <div className="grid lg:grid-cols-12 gap-6 h-full">
                    <div className="lg:col-span-5 h-full min-h-0">
                        <InputPanel
                            onVideoUpload={handleVideoUpload}
                            isProcessing={isProcessing}
                            analysisResults={analysisResults}
                        />
                    </div>
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
