// File: frontend/src/components/Chatbot.tsx

import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/Chatbot.css';

interface ChatbotProps {
  loggedIn: boolean; // Indicates user login status
  currentPage: string; // Current page (e.g., 'main', 'showDetails', 'reservation')
  showTitle?: string | null; // Title of the current show (if applicable)
}

const Chatbot: React.FC<ChatbotProps> = ({ loggedIn, currentPage, showTitle }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether chatbot is open
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]); // Chat messages
  const [userInput, setUserInput] = useState(''); // Current input field text
  const chatbotRef = useRef<HTMLDivElement>(null); // Ref to track clicks outside chatbot
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the bottom of messages

  // 자동 스크롤 함수
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll
    }
  };

  // 새로운 메시지가 추가될 때 자동으로 아래로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chatbot when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close chatbot
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!userInput.trim()) return; // Ignore empty input

    // Add user's message to chat
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    if (!loggedIn) {
      // If user is not logged in, display a message
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'This feature is available only for logged-in users. Please log in to continue.' },
      ]);
      setUserInput('');
      return;
    }

    try {
      // Send user input to backend
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput,
          currentPage,
          loggedIn,
          showTitle,
        }),
      });

      const data = await response.json();

      // Add bot's response to chat
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      // Handle errors gracefully
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Oops! Something went wrong. Please try again later.' },
      ]);
    }

    // Clear input field
    setUserInput('');
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`} ref={chatbotRef}>
        <div className="chatbot-header">
          <h4>AI Chatbot</h4>
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>

        <div className="chatbot-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          {/* 메시지 끝에 스크롤 위치를 추적하기 위한 ref 추가 */}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-footer">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
