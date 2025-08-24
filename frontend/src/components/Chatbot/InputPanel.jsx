// 2. Enhanced InputPanel.jsx with better file handling
import React, { useRef, useState } from 'react';
import { UploadIcon, VideoIcon, SendToBackendIcon, ClearIcon, RefreshIcon } from './Icons';

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
    // Reset input to allow same file selection again
    event.target.value = '';
  };

  return (
    <div
      onClick={handleUploadClick}
      className={`relative p-6 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 h-48 ${
        !isProcessing
          ? 'cursor-pointer hover:border-blue-500 hover:bg-blue-50/50'
          : 'cursor-wait opacity-50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/*,image/*"
        disabled={isProcessing}
      />
      <UploadIcon />
      <p className="text-gray-700 font-semibold mt-2">
        {isProcessing ? 'Processing...' : 'Upload Video/Image'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {isProcessing ? 'Please wait...' : 'Click here to select a file'}
      </p>
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
  const [previewError, setPreviewError] = useState(false);
  const videoURL = URL.createObjectURL(file);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Media Preview */}
      <div className="w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner">
        {previewError ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <VideoIcon />
              <p className="mt-2">Preview unavailable</p>
              <p className="text-sm opacity-75">{file.name}</p>
            </div>
          </div>
        ) : isVideo ? (
          <video
            src={videoURL}
            controls
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : isImage ? (
          <img
            src={videoURL}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <VideoIcon />
              <p className="mt-2">File uploaded</p>
              <p className="text-sm opacity-75">{file.name}</p>
            </div>
          </div>
        )}
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
            {formatFileSize(file.size)} • {file.type || 'Unknown type'}
          </p>
        </div>
        <button
          onClick={onClear}
          disabled={isProcessing}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
          title="Remove file"
        >
          <ClearIcon />
        </button>
      </div>

      {/* User Prompt Input */}
      <div className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt about the video/image..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 outline-none resize-none"
          rows="3"
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500">
          Tip: Be specific about what you want to analyze (e.g., "What objects are visible?", "Describe the scene", "Count the people")
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-4">
        <button
          onClick={onSend}
          disabled={isProcessing || !prompt.trim()}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-full py-3 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <SendToBackendIcon />
              Send for Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const InputPanel = ({ onVideoUpload, isProcessing, analysisResults, onReset, currentFile }) => {
  const [selectedFile, setSelectedFile] = useState(currentFile);
  const [userPrompt, setUserPrompt] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleSendToBackend = () => {
    if (selectedFile && userPrompt.trim()) {
      onVideoUpload({ file: selectedFile, prompt: userPrompt.trim() });
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUserPrompt('');
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-lg h-full p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800">
          Media Analysis
        </h2>
        {selectedFile && (
          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
            title="Start new analysis"
          >
            <RefreshIcon />
          </button>
        )}
      </div>

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
            Upload a video or image file to start AI analysis. You can then chat about the content and ask follow-up questions.
          </p>
          <UploadModule
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
          />
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Supported formats: MP4, AVI, MOV, WebM, JPG, PNG</p>
            <p>Max size: 100MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPanel;