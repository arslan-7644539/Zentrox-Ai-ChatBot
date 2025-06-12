import React from "react";

const Header = () => {
  return (
    <div className="flex-none border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h1 className="text-xl font-semibold text-white">Zentrox AI </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
