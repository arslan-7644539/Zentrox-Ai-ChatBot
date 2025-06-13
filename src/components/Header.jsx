import React from "react";

const Header = () => {
  return (
    <div className="flex-none border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">AI</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-white">Zentrox AI</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
