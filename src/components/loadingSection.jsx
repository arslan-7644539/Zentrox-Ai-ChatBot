import React from "react";

const LoadingSection = () => {
  return (
    <div className="mb-8">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <div className="bg-gray-700 rounded-2xl rounded-tl-md px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-sm text-gray-300">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSection;
