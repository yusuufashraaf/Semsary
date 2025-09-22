import { messageService } from '@services/axios-global';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TFullUser } from 'src/types/users/users.types';
import { Chat as ApiChat, Message as ApiMessage } from 'src/types';
import Loader from '@components/common/Loader/Loader';

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
      const response = await messageService.sendMessage(selectedConversation.chat_id, newMessage);
      
      setMessages(prev => [...prev, response.message]);
      setNewMessage('');
      
      setConversations(prev => prev.map(conv => 
        conv.user.id === selectedConversation.user.id && 
        conv.property.id === selectedConversation.property.id
          ? { ...conv, last_message: response.message, unread_count: 0 }
          : conv
      ));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading && !conversations.length) return <div className="container loading"><Loader message='Loading messages...' /></div>;

  return (
    <div className="container">
      <h1 className="heading-primary">Messages</h1>
      
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
                  messages.map(message => (
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
    </div>
  );
};

export default UserMessages;