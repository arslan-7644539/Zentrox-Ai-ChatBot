import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiImage,
  FiX,
  FiCopy,
  FiRotateCcw,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import Header from "./components/Header";
import LoadingSection from "./components/loadingSection";
import ChatBox from "./components/ChatBox";
import { useSnackbar } from "notistack";
import axios from "axios";

const App = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [textInput]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file only.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (inputText) => {
    debugger;

    const promptToSend = inputText !== undefined ? inputText : textInput;

    // if (!textInput.trim() && !selectedFile) {
    //   enqueueSnackbar("Please enter a message or select an image to upload.", {
    //     variant: "warning",
    //   });
    //   return;
    // }

    if (!promptToSend.trim()) {
      enqueueSnackbar("Please enter a message or select an image to upload.", {
        variant: "warning",
      });
      return;
    }

    // const prompt = new FormData();
    // if (selectedFile) prompt.append("file", selectedFile);
    // if (textInput.trim()) prompt.append("text", textInput);

    const userMessage = {
      type: "user",
      // text: textInput || "Image uploaded",
      text: promptToSend,
      // image: previewUrl,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChat((prev) => [...prev, userMessage]);
    setTextInput("");
    removeFile();
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 sec timeout

      //      // for backend without file upload
      // const response = await axios.post("http://localhost:3002/chating", {
      //   prompt: textInput,
      // });

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: promptToSend,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("🚀 ~ handleSend ~ response:", response);

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      console.log("🚀 ~ handleSend ~ aiResponse:", aiResponse);

      clearTimeout(timeoutId);

      console.log("🚀 ~ handleSend ~ response:", response);

      const data = response.data; // Axios response data directly in .data

      const botMessage = {
        type: "bot",
        // text: data?.result,
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "Sorry, something went wrong. Please try again.";

      if (axios.isCancel(error)) {
        errorMessage =
          "Request timed out. Try again with shorter message or smaller image.";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Unable to connect to server. Is the server running?";
      } else if (error.response && error.response.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      enqueueSnackbar(errorMessage, { variant: "error" });

      const errorBotMessage = {
        type: "bot",
        text: errorMessage,
        timestamp: new Date().toLocaleTimeString(),
        isError: true,
      };
      setChat((prev) => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      enqueueSnackbar("Text copied to clipboard!", {
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      enqueueSnackbar("Failed to copy text. Please try again.", {
        variant: "error",
      });
      setCopiedIndex(null);
    }
  };

  const regenerateResponse = async (messageIndex) => {
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex >= 0 && chat[userMessageIndex].type === "user") {
      const userMessage = chat[userMessageIndex];
      setChat((prev) => prev.slice(0, messageIndex));
      const newInputText = userMessage.type === "image" ? "" : userMessage.text;

      setTextInput(newInputText);
      // setTimeout(() => handleSend(), 100);
      try {
        await handleSend(newInputText);
      } catch (error) {
        console.error("Error regenerating response:", error);
        enqueueSnackbar("Failed to regenerate response. Please try again.", {
          variant: "error",
        });
      }
    }
  };
  const chatSection = (
    <div className="p-2 sm:p-4 bg-gray-800 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-5 mx-auto w-full max-w-full sm:max-w-4xl rounded-xl sm:rounded-4xl overflow-hidden">
      <textarea
        ref={textareaRef}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        className="w-full sm:flex-1 resize-none bg-gray-700 px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl sm:rounded-4xl"
        rows={1}
        maxLength={1000}
      />
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {selectedFile && previewUrl && (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-10 h-10 object-cover rounded-lg"
            />
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
              title="Remove"
            >
              <FiX />
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex-shrink-0"
          title="Attach Image"
        >
          <FiImage />
        </button>
        <button
          onClick={handleSend}
          disabled={loading}
          className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex-shrink-0"
          title="Send"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-screen max-w-full overflow-hidden bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full">
        <Header />
      </div>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <ChatBox
          copiedIndex={copiedIndex}
          chat={chat}
          loading={loading}
          chatEndRef={chatEndRef}
          copyToClipboard={copyToClipboard}
          regenerateResponse={regenerateResponse}
        />
      </div>

      {/* User Input Section (Textarea etc) */}
      <div className="sticky bottom-0 w-full p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">{chatSection}</div>
    </div>
  );
};

export default App;
