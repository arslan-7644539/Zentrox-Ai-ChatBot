import React from "react";
import LoadingSection from "./loadingSection";
import { FiAlertCircle, FiCheck, FiCopy, FiRotateCcw } from "react-icons/fi";

const ChatBox = ({
  loading,
  chat,
  chatEndRef,
  copiedIndex,
  copyToClipboard,
  regenerateResponse,
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full max-w-4xl mx-auto flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {chat.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-400 mb-6">
                Send a message or upload an image to get started
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
                <div className="p-3 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <div className="text-sm font-medium text-white">
                    💡 Explain a concept
                  </div>
                  <div className="text-xs text-gray-400">
                    Get detailed explanations
                  </div>
                </div>
                <div className="p-3 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <div className="text-sm font-medium text-white">
                    🖼️ Analyze an image
                  </div>
                  <div className="text-xs text-gray-400">
                    Upload and describe images
                  </div>
                </div>
              </div>
            </div>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`mb-8 ${
                msg.type === "user" ? "ml-auto max-w-2xl" : "mr-auto max-w-none"
              }`}
            >
              <div
                className={`flex items-start space-x-3 ${
                  msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : msg.isError
                      ? "bg-red-900 text-red-400"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.type === "user" ? (
                    <span className="text-sm font-medium">You</span>
                  ) : msg.isError ? (
                    <FiAlertCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">AI</span>
                  )}
                </div>

                <div
                  className={`flex-1 ${
                    msg.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-full ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md px-4 py-2"
                        : msg.isError
                        ? "bg-red-900/50 border border-red-700 text-red-300 rounded-2xl rounded-tl-md px-4 py-3"
                        : "bg-gray-700 text-gray-100 rounded-2xl rounded-tl-md px-4 py-3"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg mb-2 max-h-64 object-cover"
                      />
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.text}
                    </div>
                  </div>

                  {msg.type === "bot" && !msg.isError && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => copyToClipboard(msg.text, index)}
                        className="p-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                        title="Copy"
                      >
                        {copiedIndex === index ? <FiCheck /> : <FiCopy />}
                      </button>
                      <button
                        onClick={() => regenerateResponse(index)}
                        className="p-1 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                        title="Regenerate"
                      >
                        <FiRotateCcw />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && <LoadingSection />}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
