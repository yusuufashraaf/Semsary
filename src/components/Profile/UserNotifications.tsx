import React, { useState } from 'react';
import './UserNotifications.css';

type NotificationType = 'all' | 'unread' | 'archived';

interface Notification {
  id: number;
  type: string;
  title: string;
  time: string;
  action: string;
  content: string;
  unread: boolean;
  archived: boolean;
}

const UserNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'offer',
      title: 'New Offer',
      time: '2h ago',
      action: 'View Offer',
      content: 'Offer received for 123 Oak Street',
      unread: true,
      archived: false
    },
    {
      id: 2,
      type: 'booking',
      title: 'Booking Confirmation',
      time: '1d ago',
      action: 'View Booking',
      content: 'Your booking for 456 Maple Avenue has been confirmed.',
      unread: true,
      archived: false
    },
    {
      id: 3,
      type: 'update',
      title: 'Listing Update',
      time: '3d ago',
      action: 'View Update',
      content: 'Important update regarding your property listing at 789 Pine Lane.',
      unread: false,
      archived: false
    },
    {
      id: 4,
      type: 'offer',
      title: 'Offer Declined',
      time: '5d ago',
      action: 'View Details',
      content: 'Your offer for 101 Cedar Road has been declined.',
      unread: false,
      archived: false
    },
    {
      id: 5,
      type: 'viewing',
      title: 'New Viewing',
      time: '1w ago',
      action: 'View Schedule',
      content: 'Your property at 222 Birch Avenue has a new viewing scheduled.',
      unread: false,
      archived: true
    }
  ]);

  const handleTabChange = (tab: NotificationType) => {
    setActiveTab(tab);
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const archiveNotification = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, archived: true, unread: false } : notification
    ));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return notification.unread;
    if (activeTab === 'archived') return notification.archived;
    return !notification.archived; // For 'all' tab, show non-archived
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return 'fas fa-file-contract';
      case 'booking':
        return 'fas fa-calendar-check';
      case 'update':
        return 'fas fa-bell';
      case 'viewing':
        return 'fas fa-eye';
      default:
        return 'fas fa-bell';
    }
  };

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
          {notifications.filter(n => n.unread).length > 0 && (
            <span className="unread-count">
              {notifications.filter(n => n.unread).length}
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
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${notification.unread ? 'unread' : ''}`}
            >
              <div className="notification-header">
                <div className="notification-icon">
                  <i className={getNotificationIcon(notification.type)}></i>
                </div>
                <div className="notification-info">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {notification.unread && (
                  <div className="notification-badge"></div>
                )}
              </div>
              
              <div className="notification-content">
                <p>{notification.content}</p>
              </div>
              
              <div className="notification-actions">
                <button className="action-btn primary">
                  {notification.action}
                </button>
                <div className="secondary-actions">
                  {notification.unread && (
                    <button 
                      className="action-btn secondary"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                  {!notification.archived && (
                    <button 
                      className="action-btn secondary"
                      onClick={() => archiveNotification(notification.id)}
                    >
                      Archive
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