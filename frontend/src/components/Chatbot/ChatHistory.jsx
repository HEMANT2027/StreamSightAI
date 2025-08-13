import React, { useEffect, useRef } from 'react';
import { BotIcon, UserIcon } from './Icons';

// Component for displaying the chat history.
const ChatHistory = ({ messages, isLoading }) => {
    const chatContainerRef = useRef(null);

    // Automatically scroll to the bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            // Use requestAnimationFrame to ensure DOM updates are complete
            requestAnimationFrame(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }, [messages, isLoading]);

    return (
        <div 
            ref={chatContainerRef}
            className="flex-1 p-6 space-y-6 overflow-y-auto"
        >
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3.5 ${msg.isUser ? 'justify-end' : ''}`}>
                    {!msg.isUser && <BotIcon />}
                    <div className={`max-w-xl p-4 rounded-2xl shadow-md ${msg.isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200/60 text-gray-800 rounded-bl-none'}`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.isUser && <UserIcon />}
                </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3.5">
                    <BotIcon />
                    <div className="p-4 rounded-2xl bg-gray-200/60 rounded-bl-none">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatHistory;