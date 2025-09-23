// src/components/Chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatbot.css";

const Chatbot: React.FC = () => {
  const [userMessage, setUserMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [typingResponse, setTypingResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChatbot = () => setShowChatbot(!showChatbot);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, typingResponse]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { role: "user", content: userMessage };
    setConversation((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post(  `${import.meta.env.VITE_API_URL}/chatbot`,
 {
        query: userMessage,
      });

      const message = res.data.response || "No response.";
      animateTyping(message);
    } catch (err) {
      console.error(err);
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
      setUserMessage("");
    }
  };

  const animateTyping = (fullText: string) => {
    setTypingResponse("");
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypingResponse((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: fullText },
        ]);
        setTypingResponse("");
      }
    }, 15);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chatbot-toggle" onClick={toggleChatbot}>
        💬
      </div>

      {/* Chatbot Window */}
      {showChatbot && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            🤖 Property Assistant
            <span className="close-btn" onClick={toggleChatbot}>
              ✕
            </span>
          </div>

          <div className="chatbot-messages">
            {conversation.map((msg, i) => (
              <div key={i} className={`message-bubble ${msg.role}`}>
                <div
                  className="bubble"
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))}

            {typingResponse && (
              <div className="assistant message-bubble">
                <div className="bubble typing-bubble">
                  <span>{typingResponse}</span>
                  <span className="cursor">|</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask about a property..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
