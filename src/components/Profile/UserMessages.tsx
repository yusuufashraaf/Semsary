import { messageService } from '@services/axios-global';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TFullUser } from 'src/types/users/users.types';
import { Chat as ApiChat, Message as ApiMessage } from 'src/types';
import Loader from '@components/common/Loader/Loader';
import Pusher from 'pusher-js';
import { useAppSelector } from '@store/hook';
import axios from 'axios';
import UserMessagesOrigin from './UserMessagesOrigin';

interface Conversation {
  user: { id: number; first_name: string; last_name: string; avatar?: string };
  property: { id: number; title: string };
  last_message: ApiMessage;
  unread_count: number;
  chat_id?: number;
}

const UserMessages = ({ user }: { user: TFullUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pusherRef = React.useRef<Pusher | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { jwt } = useAppSelector(state => state.Authslice);

  // WebSocket setup for real-time messaging with custom axios authenticator
  // WebSocket setup for real-time messaging with custom axios authenticator
useEffect(() => {
  const token = jwt;
  
  if (!token) {
    console.error('❌ No auth token found in Redux store!');
    return;
  }

  // Function that creates an authorizer with the current token
  const createAuthorizer = (currentToken) => {
    return (channel, options) => ({
      authorize: (socketId, callback) => {
        console.log('🔐 Authorizing channel:', channel.name);
        
        const authApi = axios.create({
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });

        authApi.post('/user/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
        .then(response => {
          console.log('✅ Channel authorized successfully');
          callback(false, response.data);
        })
        .catch(error => {
          console.error('❌ Channel authorization failed:', error.response?.data);
          callback(true, error);
        });
      }
    });
  };

  const pusher = new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    authorizer: createAuthorizer(token),
  });

  // Add connection event listeners with better error handling
  pusher.connection.bind('connected', () => {
    console.log('✅ WebSocket connected successfully!');
    setIsConnected(true);
  });

  pusher.connection.bind('error', (error) => {
    // Only log real errors, not normal disconnections
    if (error.type !== 'WebSocketError' && !error.message?.includes('disconnect')) {
      console.error('❌ WebSocket connection error:', error);
    }
    setIsConnected(false);
  });

  pusher.connection.bind('disconnected', () => {
    console.log('🔌 WebSocket disconnected (normal)');
    setIsConnected(false);
  });

  // Monitor connection states for debugging
  pusher.connection.bind('state_change', (states) => {
    console.log('🔄 Connection state change:', states);
    // Update connection status based on state
    if (states.current === 'connected') {
      setIsConnected(true);
    } else if (states.current === 'disconnected' || states.current === 'failed') {
      setIsConnected(false);
    }
  });

  // Handle subscription events
  pusher.connection.bind('subscription_error', (error) => {
    console.error('❌ Subscription error:', error);
  });

  pusherRef.current = pusher;

  return () => {
    if (pusherRef.current) {
      console.log('🧹 Cleaning up WebSocket connection...');
      pusherRef.current.disconnect();
    }
  };
}, [jwt]);

  // Test authentication separately
  useEffect(() => {
    if (jwt) {
      // Test the auth endpoint directly using the same axios configuration
      const testAuth = async () => {
        try {
          const testApi = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          const response = await testApi.post('/user/broadcasting/auth', {
            socket_id: 'test_socket_id_123',
            channel_name: 'private-chat.1'
          });
          console.log('🔐 Auth test successful:', response.data);
        } catch (error) {
          console.error('🔐 Auth test failed:', error.response?.data || error.message);
        }
      };

      testAuth();
    }
  }, [jwt]);

  useEffect(() => {
    // Check if messageService can get chats (proves token works)
    messageService.getUserChats().then(response => {
      console.log('✅ Token is valid - fetched chats successfully');
      console.log('Number of chats:', response.chats.length);
    }).catch(error => {
      console.error('❌ Token might be invalid - failed to fetch chats:', error);
    });
  }, []);

  // Subscribe to chat channels when conversations are loaded
  // Subscribe to chat channels when conversations are loaded
useEffect(() => {
  if (!pusherRef.current || conversations.length === 0) {
    console.log('⏳ Waiting for Pusher instance or conversations...');
    return;
  }

  console.log(`📡 Attempting to subscribe to ${conversations.length} chat channels`);

  conversations.forEach(conversation => {
    if (conversation.chat_id) {
      const channelName = `private-chat.${conversation.chat_id}`;
      
      console.log(`🔔 Subscribing to channel: ${channelName}`);
      
      try {
        const channel = pusherRef.current!.subscribe(channelName);
        
        // Add subscription event listeners
        channel.bind('pusher:subscription_succeeded', () => {
          console.log(`✅ Successfully subscribed to ${channelName}`);
        });

        channel.bind('pusher:subscription_error', (error: any) => {
          console.error(`❌ Failed to subscribe to ${channelName}:`, error);
        });

        // Listen for your actual application events
        channel.bind('new.message', (data: any) => {
          console.log('📨 New message received via WebSocket:', data);
          handleNewMessage(data);
        });

        channel.bind('MessageRead', (data: any) => {
          console.log('👀 Message read event:', data);
          handleMessageRead(data);
        });

        // Add client event for testing
        channel.bind('client-message', (data: any) => {
          console.log('💬 Client event received:', data);
        });

      } catch (error) {
        console.error(`🚨 Exception subscribing to ${channelName}:`, error);
      }
    }
  });

  return () => {
    if (pusherRef.current) {
      conversations.forEach(conversation => {
        if (conversation.chat_id) {
          const channelName = `private-chat.${conversation.chat_id}`;
          pusherRef.current!.unsubscribe(channelName);
          console.log(`🔕 Unsubscribed from ${channelName}`);
        }
      });
    }
  };
}, [conversations]);

  const handleNewMessage = (data: any) => {
    const newMessageData = data.message;
    
    // Update messages if this is the currently selected conversation
    if (selectedConversation && newMessageData.chat_id === selectedConversation.chat_id) {
      setMessages(prev => [...prev, newMessageData]);
    }
    
    // Update conversations list with new last message
    setConversations(prev => prev.map(conv => 
      conv.chat_id === newMessageData.chat_id 
        ? { 
            ...conv, 
            last_message: newMessageData,
            unread_count: conv.chat_id === selectedConversation?.chat_id ? 0 : conv.unread_count + 1
          }
        : conv
    ));
  };

  const handleMessageRead = (data: any) => {
    // Update unread count when messages are read
    setConversations(prev => prev.map(conv => 
      conv.chat_id === data.chat_id 
        ? { ...conv, unread_count: data.unread_count || 0 }
        : conv
    ));
  };

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [user.id]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getUserChats();
      
      const transformedConversations = response.chats.map((chat: ApiChat) => ({
        user: chat.owner_id === user.id ? chat.renter : chat.owner,
        property: chat.property,
        last_message: chat.latest_message || createPlaceholderMessage(chat, user),
        unread_count: chat.unread_count,
        chat_id: chat.id
      }));

      setConversations(transformedConversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPlaceholderMessage = (chat: ApiChat, user: TFullUser): ApiMessage => ({
    id: 0,
    chat_id: chat.id,
    sender_id: user.id,
    content: 'Start a conversation...',
    is_read: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sender: user
  });

  const fetchMessages = async (conversation: Conversation) => {
    try {
      setLoading(true);
      const chatId = conversation.chat_id || await getOrCreateChatId(conversation);
      
      const response = await messageService.getChatMessages(chatId);
      setMessages(response.messages);
      setSelectedConversation({ ...conversation, chat_id: chatId });
      
      // Mark messages as read when opening conversation
      if (conversation.unread_count > 0) {
        await messageService.markAsRead(chatId);
        // Update conversation to remove unread count
        setConversations(prev => prev.map(conv => 
          conv.chat_id === chatId ? { ...conv, unread_count: 0 } : conv
        ));
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateChatId = async (conversation: Conversation): Promise<number> => {
    const response = await messageService.startChat(
      conversation.property.id,
      user.id,
      conversation.user.id
    );
    return response.chat.id;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.chat_id) return;

    try {
      // Send message via HTTP API (which will broadcast via WebSocket)
      await messageService.sendMessage(selectedConversation.chat_id, newMessage);
      
      // Clear input - the message will appear via WebSocket
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading && !conversations.length) return <div className="container loading"><Loader message='Loading messages...' /></div>;

// Add this function to test real-time messaging
const testRealTimeMessaging = async () => {
  if (!selectedConversation?.chat_id) return;
  
  try {
    console.log('🧪 Testing real-time messaging...');
    
    // Send a test message with timestamp
    const testMessage = `Test real-time message at ${new Date().toLocaleTimeString()}`;
    await messageService.sendMessage(selectedConversation.chat_id, testMessage);
    console.log('✅ Test message sent via HTTP');
    
    // Check if Pusher is connected and has active subscriptions
    if (pusherRef.current) {
      const connectionState = pusherRef.current.connection.state;
      console.log('🔌 Pusher connection state:', connectionState);
      
      // List all active subscriptions
      const subscriptions = Object.keys(pusherRef.current.channels.channels);
      console.log('📡 Active channel subscriptions:', subscriptions);
    }
    
  } catch (error) {
    console.error('❌ Failed to send test message:', error);
  }
};

// Add a test button to your UI temporarily


  return (
    <div className="container">
      <h1 className="heading-primary">Messages</h1>
      <button 
  onClick={testRealTimeMessaging}
  style={{
    marginBottom: '10px',
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }}
>
  Test Real-Time Messaging
</button>
      
      <div style={{ 
        padding: '10px', 
        marginBottom: '20px',
        background: isConnected ? '#d4edda' : '#f8d7da',
        color: isConnected ? '#155724' : '#721c24',
        borderRadius: '4px',
        border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`
      }}>
        <strong>WebSocket Status:</strong> {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
        {!isConnected && (
          <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
            Real-time messages will not work until connected.
          </div>
        )}
      </div>
      
      <div className="messages-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 2fr', 
        gap: 'var(--spacing-lg)', 
        minHeight: '600px',
        marginTop: 'var(--spacing-lg)'
      }}>
        {/* Conversations List */}
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <div className="heading-tertiary" style={{ 
            padding: 'var(--spacing-lg)', 
            borderBottom: '1px solid var(--primary-border)',
            margin: 0,
            background: 'var(--secondary-color)'
          }}>
            Conversations
          </div>
          
          <div className="list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {conversations.length > 0 ? (
              conversations.map(conv => (
                <div
                  key={`${conv.user.id}-${conv.property.id}`}
                  className={`list-item card-hover ${selectedConversation?.user.id === conv.user.id ? 'active' : ''}`}
                  onClick={() => fetchMessages(conv)}
                  style={{
                    cursor: 'pointer',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--primary-border)',
                    backgroundColor: selectedConversation?.user.id === conv.user.id ? 'var(--secondary-color)' : 'var(--primary-bg)',
                    transition: 'all 0.3s ease',
                    margin: 0,
                    border: 'none',
                    borderRadius: 0
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                    <img
                      src={conv.user.avatar || '/default-avatar.png'}
                      alt={conv.user.first_name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--primary-border)'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                        <strong style={{ 
                          color: 'var(--primary-color)', 
                          fontSize: 'var(--font-size-base)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {conv.user.first_name} {conv.user.last_name}
                        </strong>
                        {conv.unread_count > 0 && (
                          <span style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'var(--white)',
                            borderRadius: '50%',
                            minWidth: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            padding: '0 var(--spacing-sm)'
                          }}>
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p style={{ 
                        margin: 'var(--spacing-xs) 0', 
                        color: 'var(--primary-color)', 
                        opacity: 0.8, 
                        fontSize: '0.9rem',
                        fontWeight: 500
                      }}>
                        {conv.property.title}
                      </p>
                      <p style={{ 
                        margin: 'var(--spacing-xs) 0', 
                        color: 'var(--primary-color)', 
                        opacity: 0.7, 
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conv.last_message.content}
                      </p>
                      <small style={{ 
                        color: 'var(--primary-color)', 
                        opacity: 0.6,
                        fontSize: '0.8rem'
                      }}>
                        {new Date(conv.last_message.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ margin: 'var(--spacing-lg)' }}>
                <i className="fas fa-comments empty-state-icon"></i>
                <h3>No conversations yet</h3>
                <p>Start a conversation by contacting a property owner or responding to inquiries.</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0,
          height: '600px'
        }}>
          {selectedConversation ? (
            <>
              <div style={{ 
                padding: 'var(--spacing-lg)', 
                borderBottom: '1px solid var(--primary-border)',
                background: 'var(--secondary-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                  <h3 className="heading-tertiary" style={{ margin: 0 }}>
                    {selectedConversation.user.first_name} {selectedConversation.user.last_name}
                  </h3>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/property/${selectedConversation.property.id}`)}
                    style={{ 
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      fontSize: '0.9rem'
                    }}
                  >
                    View Property
                  </button>
                </div>
                <p style={{ 
                  margin: 'var(--spacing-sm) 0 0 0', 
                  color: 'var(--primary-color)', 
                  opacity: 0.8,
                  fontSize: '0.9rem'
                }}>
                  {selectedConversation.property.title}
                </p>
              </div>

              <div style={{ 
                flex: 1, 
                padding: 'var(--spacing-lg)', 
                overflowY: 'auto', 
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: 'var(--spacing-md)'
              }}>
                {loading ? (
                  <div className="loading"> <Loader message='Loading messages...' /> </div>
                ) : messages.length > 0 ? (
                  messages
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .reverse()
                    .map(message => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.sender_id === user.id ? 'flex-end' : 'flex-start',
                        marginBottom: 'var(--spacing-md)'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: message.sender_id === user.id ? 'var(--primary-color)' : 'var(--secondary-color)',
                          color: message.sender_id === user.id ? 'var(--white)' : 'var(--primary-color)',
                          border: message.sender_id === user.id ? 'none' : '1px solid var(--primary-border)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <p style={{ 
                          margin: 0, 
                          lineHeight: 1.4,
                          fontSize: 'var(--font-size-base)'
                        }}>
                          {message.content}
                        </p>
                        <small style={{ 
                          opacity: 0.7, 
                          display: 'block', 
                          marginTop: 'var(--spacing-sm)',
                          fontSize: '0.8rem'
                        }}>
                          {new Date(message.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ margin: 'auto', padding: 'var(--spacing-lg)' }}>
                    <i className="fas fa-comment empty-state-icon"></i>
                    <h3>No messages yet</h3>
                    <p>Start the conversation by sending a message</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} style={{ 
                padding: 'var(--spacing-lg)', 
                borderTop: '1px solid var(--primary-border)',
                background: 'var(--secondary-color)'
              }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-md) var(--spacing-lg)',
                      border: '1px solid var(--primary-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!newMessage.trim()}
                    style={{
                      padding: 'var(--spacing-md) var(--spacing-lg)',
                      opacity: !newMessage.trim() ? 0.6 : 1,
                      cursor: !newMessage.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-state" style={{ margin: 'auto', padding: 'var(--spacing-xl)' }}>
              <i className="fas fa-comment empty-state-icon"></i>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
      <UserMessagesOrigin />
    </div>
  );
};

export default UserMessages;