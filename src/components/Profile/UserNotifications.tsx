import React, { useState, useEffect } from 'react';
import './UserNotifications.css';
import { fetchUserNotifications } from '@services/axios-global';

type NotificationType = 'all' | 'unread' | 'archived';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const UserNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNotificationsData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserNotifications(7); // Replace with actual user ID
        setNotifications(data);
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNotificationsData();
  }, []);

  const handleTabChange = (tab: NotificationType) => {
    setActiveTab(tab);
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, is_read: true } : notification
    ));
    // Here you would also call your API to update the notification status
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('booking')) return 'fas fa-calendar-check';
    if (lowerTitle.includes('payment')) return 'fas fa-credit-card';
    if (lowerTitle.includes('welcome')) return 'fas fa-hand-wave';
    if (lowerTitle.includes('offer')) return 'fas fa-file-contract';
    if (lowerTitle.includes('update')) return 'fas fa-bell';
    return 'fas fa-bell';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.is_read;
    if (activeTab === 'archived') return false; // Your data doesn't have archived field
    return true; // For 'all' tab, show all notifications
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="notifications">
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="notifications">
      <h1 className="notifications-title">Notifications</h1>
      
      <div className="notifications-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All
        </button>
        <button 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => handleTabChange('unread')}
        >
          Unread
          {unreadCount > 0 && (
            <span className="unread-count">
              {unreadCount}
            </span>
          )}
        </button>
        <button 
          className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => handleTabChange('archived')}
        >
          Archived
        </button>
      </div>
      
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-bell-slash"></i>
            <p>
              {activeTab === 'unread' 
                ? 'No unread notifications' 
                : activeTab === 'archived'
                ? 'No archived notifications'
                : 'No notifications found'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.is_read ? 'unread' : ''}`}
            >
              <div className="notification-header">
                <div className="notification-icon">
                  <i className={getNotificationIcon(notification.title)}></i>
                </div>
                <div className="notification-info">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-time">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                {!notification.is_read && (
                  <div className="notification-badge"></div>
                )}
              </div>
              
              <div className="notification-content">
                <p>{notification.message}</p>
              </div>
              
              <div className="notification-actions">
                <button className="action-btn primary">
                  View Details
                </button>
                <div className="secondary-actions">
                  {!notification.is_read && (
                    <button 
                      className="action-btn secondary"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserNotifications;