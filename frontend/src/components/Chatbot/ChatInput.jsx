import React, { useState } from 'react';
import { SendIcon } from './Icons';

// Component for the user's chat input.
const ChatInput = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="p-4 border-t border-gray-200/80">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a follow-up question..."
                    className="w-full bg-gray-100/80 text-gray-800 placeholder-gray-500 rounded-full py-3.5 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSend} 
                    disabled={isLoading} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
