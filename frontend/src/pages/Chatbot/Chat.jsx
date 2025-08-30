// 1. Enhanced Chat.jsx with better state management and error handling
import React, { useState, useEffect, useRef } from 'react';
import AnimatedBackground from '../../components/Chatbot/AnimatedBackground';
import InputPanel from '../../components/Chatbot/InputPanel';
import ChatPanel from '../../components/Chatbot/ChatPanel';
import { sendMessage, checkServerHealth, validateVideoFile } from '../../utils/api';

// Helper to generate unique session IDs
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const Chat = () => {
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [messages, setMessages] = useState([
        { 
            text: "Welcome! Please upload a video to begin the analysis.", 
            isUser: false, 
            timestamp: new Date() 
        },
    ]);
    const [isBotLoading, setIsBotLoading] = useState(false);
    const [isServerOnline, setIsServerOnline] = useState(true);
    const [currentFile, setCurrentFile] = useState(null);
    
    // Use useRef to maintain session ID consistency
    const sessionIdRef = useRef(generateSessionId());
    
    // Get current session ID
    const getSessionId = () => sessionIdRef.current;

    // Check server health on component mount
    useEffect(() => {
        const checkHealth = async () => {
            const isOnline = await checkServerHealth();
            setIsServerOnline(isOnline);
            if (!isOnline) {
                setMessages(prev => [...prev, {
                    text: "⚠️ Warning: Cannot connect to server. Please check if the backend is running.",
                    isUser: false,
                    timestamp: new Date(),
                    isError: true
                }]);
            }
        };
        checkHealth();
    }, []);

    // Handle video + prompt upload
    const handleVideoUpload = async ({ file, prompt }) => {
        // Validate file first
        const validation = validateVideoFile(file);
        if (!validation.isValid) {
            setMessages(prev => [...prev, {
                text: `❌ File validation failed: ${validation.error}`,
                isUser: false,
                timestamp: new Date(),
                isError: true
            }]);
            return;
        }

        setIsProcessing(true);
        setCurrentFile(file);
        
        // Add user message to chat
        const userMessage = prompt || "Analyze this video";
        setMessages(prev => [...prev, { 
            text: userMessage, 
            isUser: true, 
            timestamp: new Date() 
        }]);

        try {
            console.log('🎬 Uploading video with session:', getSessionId());
            const result = await sendMessage(userMessage, file, getSessionId());
            
            console.log('✅ Video analysis result:', result);
            
            setAnalysisResults(result.response);
            setIsVideoUploaded(true);

            // Add bot response to chat
            setMessages(prev => [
                ...prev,
                { 
                    text: result.response, 
                    isUser: false, 
                    timestamp: new Date() 
                }
            ]);
        } catch (error) {
            console.error('❌ Video upload error:', error);
            setMessages(prev => [
                ...prev, 
                { 
                    text: `❌ Upload failed: ${error.message}`, 
                    isUser: false, 
                    timestamp: new Date(),
                    isError: true 
                }
            ]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle text chat
    const handleSendMessage = async (messageText) => {
        if (!messageText.trim()) return;

        // Add user message immediately
        setMessages(prev => [...prev, { 
            text: messageText, 
            isUser: true, 
            timestamp: new Date() 
        }]);
        setIsBotLoading(true);

        try {
            console.log('💬 Sending follow-up with session:', getSessionId());
            const result = await sendMessage(messageText, null, getSessionId());
            
            console.log('✅ Follow-up result:', result);
            
            // Add bot response
            setMessages(prev => [
                ...prev, 
                { 
                    text: result.response, 
                    isUser: false, 
                    timestamp: new Date() 
                }
            ]);
        } catch (error) {
            console.error('❌ Follow-up error:', error);
            setMessages(prev => [
                ...prev, 
                { 
                    text: `❌ Message failed: ${error.message}`, 
                    isUser: false, 
                    timestamp: new Date(),
                    isError: true 
                }
            ]);
        } finally {
            setIsBotLoading(false);
        }
    };

    // Reset session when component mounts or resets
    const resetSession = () => {
        sessionIdRef.current = generateSessionId();
        setIsVideoUploaded(false);
        setAnalysisResults(null);
        setCurrentFile(null);
        setMessages([
            { 
                text: "Welcome! Please upload a video to begin the analysis.", 
                isUser: false, 
                timestamp: new Date() 
            }
        ]);
        console.log('🔄 New session created:', sessionIdRef.current);
    };

    // Export chat history
    const exportChatHistory = () => {
        const chatData = {
            sessionId: getSessionId(),
            timestamp: new Date().toISOString(),
            messages: messages.map(msg => ({
                text: msg.text,
                isUser: msg.isUser,
                timestamp: msg.timestamp.toISOString()
            })),
            videoFile: currentFile ? {
                name: currentFile.name,
                size: currentFile.size,
                type: currentFile.type
            } : null
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${getSessionId()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="chat-container relative w-full bg-gray-100 overflow-hidden font-sans pt-12 pb-6 p-12">
            <AnimatedBackground />
            <div className="relative container mx-auto px-4 lg:px-6 h-[calc(100vh-120px)] overflow-hidden">
                {/* Status Bar */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                            {isServerOnline ? 'Server Online' : 'Server Offline'}
                        </span>
                        <span className="text-xs text-gray-400 ml-4">
                            Session: {getSessionId().slice(-8)}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {messages.length > 1 && (
                            <button
                                onClick={exportChatHistory}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                Export Chat
                            </button>
                        )}
                        <button
                            onClick={resetSession}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            New Session
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 h-full">
                    <div className="lg:col-span-5 h-full min-h-0">
                        <InputPanel
                            onVideoUpload={handleVideoUpload}
                            isProcessing={isProcessing}
                            analysisResults={analysisResults}
                            onReset={resetSession}
                            currentFile={currentFile}
                        />
                    </div>
                    <div className="lg:col-span-7 h-full min-h-0">
                        <ChatPanel
                            isVideoUploaded={isVideoUploaded}
                            messages={messages}
                            isBotLoading={isBotLoading}
                            onSendMessage={handleSendMessage}
                            sessionId={getSessionId()}
                            isServerOnline={isServerOnline}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Chat;