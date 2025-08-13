import React, { useRef, useState } from 'react';
import { UploadIcon, VideoIcon, SendToBackendIcon, ClearIcon } from './Icons';

const UploadModule = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (!isProcessing) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={handleUploadClick}
      className={`relative p-6 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 h-48 ${
        !isProcessing
          ? 'cursor-pointer hover:border-blue-500 hover:bg-blue-50/50'
          : 'cursor-wait'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/*"
        disabled={isProcessing}
      />
      <UploadIcon />
      <p className="text-gray-700 font-semibold mt-2">Upload Video</p>
      <p className="text-xs text-gray-500 mt-1">Click here to select a file</p>
    </div>
  );
};

const FilePreview = ({
  file,
  prompt,
  setPrompt,
  onSend,
  onClear,
  isProcessing,
}) => {
  const videoURL = URL.createObjectURL(file);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Video Preview */}
      <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner">
        <video
          src={videoURL}
          controls
          className="w-full h-full object-cover"
        ></video>
      </div>

      {/* File Information */}
      <div className="p-3 bg-white/80 rounded-lg border border-gray-200/80 flex items-center gap-3">
        <VideoIcon />
        <div className="flex-1 overflow-hidden">
          <p
            className="font-semibold text-sm text-gray-800 truncate"
            title={file.name}
          >
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {Math.round(file.size / 1024)} KB
          </p>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
        >
          <ClearIcon />
        </button>
      </div>

      {/* User Prompt Input */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt about the video..."
        className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 outline-none"
      />

      {/* Action Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={onSend}
          disabled={isProcessing}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-full py-3 transition-all duration-300 transform hover:scale-105"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <SendToBackendIcon />
              Send to Backend for Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const InputPanel = ({ onVideoUpload, isProcessing, analysisResults }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSendToBackend = () => {
    if (selectedFile) {
      onVideoUpload({ file: selectedFile, prompt: userPrompt });
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUserPrompt('');
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-lg h-full p-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 flex-shrink-0">
        Analysis Control
      </h2>

      {selectedFile ? (
        <FilePreview
          file={selectedFile}
          prompt={userPrompt}
          setPrompt={setUserPrompt}
          onSend={handleSendToBackend}
          onClear={handleClearFile}
          isProcessing={isProcessing}
        />
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Start by uploading a video file. The AI will process it and generate
            a summary of key events.
          </p>
          <UploadModule
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
          />
        </div>
      )}
    </div>
  );
};

export default InputPanel;
