import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useAppSelector } from '@store/hook';
import { Chat, Message } from '@app-types/index';
import { messageService } from '@services/axios-global';

const UserMessagesOrigin = () => {
  // State for current message input and message history
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentchatid, setCurrentchatId] = useState<number | null>(0);
  const [allchats, setAllchats] = useState<Chat[]>([]);
  const [availablechats, setavailablechats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {jwt, user} = useAppSelector(state => state.Authslice);

  // Ref for the messages container only
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom function for the messages container only
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages change or chat switches
  useEffect(() => {
    scrollToBottom('auto'); // Instant scroll on initial load and chat switch
  }, [messages, currentchatid]);

  // Scroll to bottom when new messages are added (with smooth animation)
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // WebSocket connection setup
  useEffect(() => {
    if (!currentchatid) return;

    const pusher = new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT,
      forceTLS: false,
      disableStats: true,
      cluster: 'mt1',
    });

    const channelName = 'chat.' + currentchatid;
    const channel = pusher.subscribe(channelName);
    
    console.log('Subscribed to channel:', channelName);
    
    channel.bind('MessageSent', (data) => {
      console.log('New message received:', data);
      
      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [currentchatid]);

  const sendMessage = async () => {
    if (!message.trim() || !currentchatid || !user?.id) return;
    
    try {
      setLoading(true);
      await fetch(import.meta.env.VITE_API_URL + '/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: message,
          sender_id: user.id,
          chat_id: currentchatid
        })
      });
      
      console.log('Message sent:', message, 'from user:', user.id, 'in chat:', currentchatid);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(import.meta.env.VITE_API_URL + '/fetch-messages/' + chatId);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      const messagesData = Array.isArray(data) ? data : (data.messages || []);
      setMessages(messagesData);
      
      console.log('Fetched messages for chat', chatId, ':', messagesData);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllChats = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(import.meta.env.VITE_API_URL + '/fetch-chats/' + userId);
      if (!response.ok) throw new Error('Failed to fetch chats');
      
      const data = await response.json();
      const chatsData = data.chats || [];
      setAllchats(chatsData);
      
      console.log('Fetched all chats:', chatsData);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      setError('Failed to load chats');
      setAllchats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableChats = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageService.getAvailableNewChats(userId);
      if (!response) throw new Error('Failed to fetch chats');
      console.log(response);
      // const data = await response.json();
      // const chatsData = data.chats || [];
      // setAllchats(chatsData);
      setavailablechats(response.rentrequests);
      console.log(response.rentrequests)
      // console.log('Fetched all chats:', chatsData);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      setError('Failed to load chats');
      setAllchats([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user?.id) {
      fetchAllChats(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (currentchatid) {
      fetchMessages(currentchatid);
    }
  }, [currentchatid]);

  useEffect(() => {
    if (user?.id) {
      fetchAvailableChats(user.id);
    }
  }, [user?.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleChatSelect = (chatId: number) => {
    setCurrentchatId(chatId);
    setMessages([]);
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && messages.length === 0 && allchats.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading chats...</div>
      </div>
    );
  }

  if (error && allchats.length === 0) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
        <button onClick={() => user?.id && fetchAllChats(user.id)} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="heading-primary">Messages</h1>
      </div>

      <div className="chat-layout">
        {/* Chats Sidebar */}
        <div className="chat-sidebar">
          <h2 className="heading-secondary">Conversations</h2>
          <div className="chat-list">
            {allchats?.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}></i>
                <h3>No Conversations</h3>
                <p>You don't have any active conversations yet.</p>
              </div>
            ) : (
              allchats?.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`chat-list-item card card-hover ${chat.id === currentchatid ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="chat-preview">
                    <div className="chat-header">
                      <h4 className="heading-tertiary">
                        {chat.property?.title || `Chat #${chat.id}`}
                      </h4>
                      <span className="chat-time">
                        {formatTime(chat.last_message_at)}
                      </span>
                    </div>
                    <p className="chat-last-message">
                      {chat.latest_message?.content || 'No messages yet'}
                    </p>
                    {chat.unread_count > 0 && (
                      <span className="unread-badge">{chat.unread_count}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="chat-main">
          {currentchatid ? (
            <>
              <div 
                ref={messagesContainerRef}
                className="messages-container"
              >
                {messages?.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-comment" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}></i>
                    <h3>No Messages</h3>
                    <p>Start a conversation by sending a message.</p>
                  </div>
                ) : (
                  messages?.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`message-bubble ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <span>{msg.content}</span>
                        <span className="message-time">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="message-input-container">
                <input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="message-input"
                  disabled={loading}
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!message.trim() || loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-comment-dots" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}></i>
              <h3>Select a Conversation</h3>
              <p>Choose a chat from the sidebar to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--spacing-lg);
          height: 600px;
        }

        .chat-sidebar {
          background: var(--primary-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--primary-border);
          padding: var(--spacing-lg);
          overflow-y: auto;
        }

        .chat-main {
          display: flex;
          flex-direction: column;
          background: var(--primary-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--primary-border);
          overflow: hidden;
        }

        .chat-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .chat-list-item {
          padding: var(--spacing-md);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
        }

        .chat-list-item.active {
          border-color: var(--primary-color);
          background: var(--secondary-color);
        }

        .chat-list-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .chat-time {
          font-size: 0.8rem;
          color: var(--primary-color);
          opacity: 0.7;
        }

        .chat-last-message {
          margin: 0;
          color: var(--primary-color);
          opacity: 0.8;
          font-size: 0.9rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .unread-badge {
          background: var(--accent-color);
          color: var(--white);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: var(--spacing-sm);
        }

        .messages-container {
          flex: 1;
          padding: var(--spacing-lg);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          scroll-behavior: smooth; /* Enable smooth scrolling */
        }

        .message-bubble {
          max-width: 70%;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          position: relative;
        }

        .message-bubble.sent {
          align-self: flex-end;
          background: var(--primary-color);
          color: var(--white);
          border-bottom-right-radius: var(--radius-sm);
        }

        .message-bubble.received {
          align-self: flex-start;
          background: var(--secondary-color);
          color: var(--primary-color);
          border-bottom-left-radius: var(--radius-sm);
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
          align-self: flex-end;
        }

        .message-input-container {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          border-top: 1px solid var(--primary-border);
          background: var(--primary-bg);
        }

        .message-input {
          flex: 1;
          padding: var(--spacing-md);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-base);
        }

        .message-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        @media (max-width: 768px) {
          .chat-layout {
            grid-template-columns: 1fr;
            height: auto;
          }
          
          .chat-sidebar {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserMessagesOrigin;