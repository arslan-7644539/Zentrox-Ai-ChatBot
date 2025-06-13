import React from "react";

const LoadingSection = () => {
  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs sm:text-sm font-bold">AI</span>
        </div>
        <div className="bg-gray-700 rounded-2xl rounded-tl-md px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div
                className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-300">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSection;
