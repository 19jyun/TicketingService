import React, { useState, useRef, useEffect } from "react";
import "../styles/components/Chatbot.css";

interface ChatbotProps {
  loggedIn: string | null;
  currentPage: string;
  showTitle?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ loggedIn, currentPage, showTitle }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]); 
  const [userInput, setUserInput] = useState(""); 
  const chatbotRef = useRef<HTMLDivElement>(null); 
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    if (!loggedIn) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "This feature is available only for logged-in users. Please log in to continue.",
        },
      ]);
      setUserInput("");
      return;
    }

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          currentPage,
          loggedIn,
          showTitle,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Please try again later." },
      ]);
    }

    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          className={`chatbot-toggle ${isOpen ? "hidden" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      )}

      <div className={`chatbot-window ${isOpen ? "open" : ""}`} ref={chatbotRef}>
        <div className="chatbot-header">
          <h4>AI Chatbot</h4>
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>

        <div className="chatbot-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-footer">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
