import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';


const UserMessagesOrigin = () => {
  // State for current message input and message history
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  // WebSocket connection setup
  useEffect(() => {
    // Connect to Laravel Reverb WebSocket server
    const pusher = new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
      wsHost: import.meta.env.VITE_REVERB_HOST, // Server host (127.0.0.1)
      wsPort: import.meta.env.VITE_REVERB_PORT, // Server port (8080)
      forceTLS: false, // No HTTPS needed for local development
      disableStats: true, // Disable usage statistics
      cluster: 'mt1', // Required by Pusher.js (arbitrary value)
    });

    // Subscribe to the 'chat' channel
    const channel = pusher.subscribe('chat');
    
    // Listen for new messages from the server
    channel.bind('MessageSent', (data) => {
      // Add new message to the list
      setMessages(prevMessages => [...prevMessages, data.message]);
    });

    // Cleanup: disconnect when component unmounts
    return () => pusher.disconnect();
  }, []); // Empty dependency array = run once on mount

  // Send message to Laravel backend
  const sendMessage = async () => {
    // Don't send empty messages
    if (!message.trim()) return;
    
    try {
      // Send HTTP POST to Laravel API
      await fetch(import.meta.env.VITE_API_URL + '/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }) // Send message as JSON
      });
      
      // Clear input field after sending
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Send message when Enter key is pressed
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h1>Simple Chat</h1>
      
      {/* Message display area */}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">{msg}</div>
        ))}
      </div>
      
      {/* Message input and send button */}
      <div className="input-container">
        <input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} // Update message state
          onKeyPress={handleKeyPress} // Send on Enter key
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default UserMessagesOrigin;