import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TFullUser } from 'src/types/users/users.types';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  property_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  receiver: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  property: {
    id: number;
    title: string;
    price: string;
    price_type: string;
    location: {
      address: string;
      city: string;
      state: string;
      zip_code: string;
    };
  };
}

interface Conversation {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  property: {
    id: number;
    title: string;
  };
  last_message: Message;
  unread_count: number;
}

const UserMessages = ({ user }: { user: TFullUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockConversations: Conversation[] = [
            {
              user: {
                id: 2,
                first_name: 'Sarah',
                last_name: 'Johnson',
                avatar: 'https://via.placeholder.com/40'
              },
              property: {
                id: 1,
                title: 'Beautiful Downtown Apartment'
              },
              last_message: {
                id: 1,
                sender_id: 2,
                receiver_id: user.id,
                property_id: 1,
                content: 'Hi, I\'m interested in your apartment. Is it still available?',
                is_read: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                sender: {
                  id: 2,
                  first_name: 'Sarah',
                  last_name: 'Johnson'
                },
                receiver: {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name
                },
                property: {
                  id: 1,
                  title: 'Beautiful Downtown Apartment',
                  price: '250000',
                  price_type: 'sale',
                  location: {
                    address: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zip_code: '10001'
                  }
                }
              },
              unread_count: 2
            },
            {
              user: {
                id: 3,
                first_name: 'Mike',
                last_name: 'Chen',
                avatar: 'https://via.placeholder.com/40'
              },
              property: {
                id: 2,
                title: 'Luxury Beach House'
              },
              last_message: {
                id: 2,
                sender_id: user.id,
                receiver_id: 3,
                property_id: 2,
                content: 'Looking forward to seeing the property tomorrow!',
                is_read: true,
                created_at: new Date(Date.now() - 86400000).toISOString(),
                updated_at: new Date(Date.now() - 86400000).toISOString(),
                sender: {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name
                },
                receiver: {
                  id: 3,
                  first_name: 'Mike',
                  last_name: 'Chen'
                },
                property: {
                  id: 2,
                  title: 'Luxury Beach House',
                  price: '4500',
                  price_type: 'monthly',
                  location: {
                    address: '456 Ocean Blvd',
                    city: 'Miami',
                    state: 'FL',
                    zip_code: '33139'
                  }
                }
              },
              unread_count: 0
            }
          ];
          setConversations(mockConversations);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user.id]);

  const fetchMessages = async (conversation: Conversation) => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: 1,
            sender_id: 2,
            receiver_id: user.id,
            property_id: 1,
            content: 'Hi, I\'m interested in your apartment. Is it still available?',
            is_read: true,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            sender: {
              id: 2,
              first_name: 'Sarah',
              last_name: 'Johnson'
            },
            receiver: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name
            },
            property: {
              id: 1,
              title: 'Beautiful Downtown Apartment',
              price: '250000',
              price_type: 'sale',
              location: {
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip_code: '10001'
              }
            }
          },
          {
            id: 2,
            sender_id: user.id,
            receiver_id: 2,
            property_id: 1,
            content: 'Yes, it\'s still available! Would you like to schedule a viewing?',
            is_read: true,
            created_at: new Date(Date.now() - 1800000).toISOString(),
            updated_at: new Date(Date.now() - 1800000).toISOString(),
            sender: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name
            },
            receiver: {
              id: 2,
              first_name: 'Sarah',
              last_name: 'Johnson'
            },
            property: {
              id: 1,
              title: 'Beautiful Downtown Apartment',
              price: '250000',
              price_type: 'sale',
              location: {
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip_code: '10001'
              }
            }
          }
        ];
        setMessages(mockMessages);
        setSelectedConversation(conversation);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to fetch messages');
      console.error(err);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // Simulate sending message
      const newMsg: Message = {
        id: Date.now(),
        sender_id: user.id,
        receiver_id: selectedConversation.user.id,
        property_id: selectedConversation.property.id,
        content: newMessage,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name
        },
        receiver: selectedConversation.user,
        property: selectedConversation.last_message.property
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  const formatAddress = (location: any) => {
    if (!location) return 'Address not available';
    
    const parts = [
      location.address,
      location.city,
      location.state,
      location.zip_code
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading-primary">Messages</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-lg)', minHeight: '600px' }}>
        {/* Conversations List */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <h3 className="heading-tertiary" style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--primary-border)' }}>
            Conversations
          </h3>
          
          <div className="list">
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <div
                  key={`${conversation.user.id}-${conversation.property.id}`}
                  className={`list-item ${selectedConversation?.user.id === conversation.user.id && selectedConversation?.property.id === conversation.property.id ? 'active' : ''}`}
                  onClick={() => fetchMessages(conversation)}
                  style={{
                    cursor: 'pointer',
                    padding: 'var(--spacing-md)',
                    borderBottom: '1px solid var(--primary-border)',
                    backgroundColor: selectedConversation?.user.id === conversation.user.id && selectedConversation?.property.id === conversation.property.id ? 'var(--secondary-color)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <img
                      src={conversation.user.avatar || 'https://via.placeholder.com/40'}
                      alt={`${conversation.user.first_name} ${conversation.user.last_name}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{conversation.user.first_name} {conversation.user.last_name}</strong>
                        {conversation.unread_count > 0 && (
                          <span style={{
                            backgroundColor: 'var(--accent-color)',
                            color: 'var(--white)',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem'
                          }}>
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 'var(--spacing-sm) 0', color: 'var(--primary-color)', opacity: 0.8, fontSize: '0.9rem' }}>
                        {conversation.property.title}
                      </p>
                      <p style={{ margin: 0, color: 'var(--primary-color)', opacity: 0.7, fontSize: '0.8rem' }}>
                        {conversation.last_message.content.slice(0, 50)}...
                      </p>
                      <small style={{ color: 'var(--primary-color)', opacity: 0.6 }}>
                        {formatTime(conversation.last_message.created_at)}
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
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--primary-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="heading-tertiary">
                    {selectedConversation.user.first_name} {selectedConversation.user.last_name}
                  </h3>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/property/${selectedConversation.property.id}`)}
                  >
                    View Property
                  </button>
                </div>
                <p style={{ margin: 'var(--spacing-sm) 0', color: 'var(--primary-color)', opacity: 0.8 }}>
                  {selectedConversation.property.title}
                </p>
                <p style={{ margin: 0, color: 'var(--primary-color)', opacity: 0.7, fontSize: '0.9rem' }}>
                  {formatAddress(selectedConversation.last_message.property.location)}
                </p>
              </div>

              <div style={{ flex: 1, padding: 'var(--spacing-md)', overflowY: 'auto', maxHeight: '400px' }}>
                {loading ? (
                  <div className="loading">Loading messages...</div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      style={{
                        marginBottom: 'var(--spacing-md)',
                        textAlign: message.sender_id === user.id ? 'right' : 'left'
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-block',
                          padding: 'var(--spacing-md)',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: message.sender_id === user.id ? 'var(--primary-color)' : 'var(--secondary-color)',
                          color: message.sender_id === user.id ? 'var(--white)' : 'var(--primary-color)',
                          maxWidth: '70%'
                        }}
                      >
                        <p style={{ margin: 0 }}>{message.content}</p>
                        <small style={{ opacity: 0.7, display: 'block', marginTop: 'var(--spacing-sm)' }}>
                          {formatTime(message.created_at)}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--primary-border)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--primary-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-base)'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-state" style={{ margin: 'auto' }}>
              <i className="fas fa-comment empty-state-icon"></i>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMessages;