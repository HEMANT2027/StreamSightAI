import React from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { BotIcon } from './Icons';

// --- Main Chat Panel Component ---
const ChatPanel = ({ isVideoUploaded, messages, isBotLoading, onSendMessage }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-lg h-full flex flex-col">
            {isVideoUploaded ? (
                <>
                    <ChatHistory messages={messages} isLoading={isBotLoading} />
                    <ChatInput onSend={onSendMessage} isLoading={isBotLoading} />
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <BotIcon />
                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Awaiting Video Analysis</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Please upload a video using the panel on the left to activate the chat.</p>
                </div>
            )}
        </div>
    );
};

export default ChatPanel;
