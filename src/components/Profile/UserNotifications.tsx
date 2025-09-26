import  { useState, useEffect } from "react";
import { fetchUserNotifications, markNotificationAsRead } from "@services/axios-global";
import { useNotifications } from "@hooks/useNotifications";
import { TFullUser } from "src/types/users/users.types";
import './UserNotifications.css';

type NotificationType = 'all' | 'unread';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  property_id?: number;
}

const UserNotifications = ({ user, onUnreadCountChange }: {user: TFullUser, onUnreadCountChange?: (count: number) => void }) => {
  const [activeTab, setActiveTab] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔌 Subscribe to WebSocket
  useNotifications(user?.id ?? null);

  useEffect(() => {
    const getNotificationsData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserNotifications(user.id);
        setNotifications(data); // API loads history
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNotificationsData();
  }, [user.id]);

  const handleTabChange = (tab: NotificationType) => {
    setActiveTab(tab);
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, is_read: true } : notification
    ));
    markNotificationAsRead(user.id, id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications = notifications
  .filter(notification => {
    if (activeTab === 'unread') return !notification.is_read;
    return true;
  })
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2 className="notifications-title">Notifications</h2>
        {unreadCount > 0 && (
          <span className="total-unread-badge">{unreadCount} unread</span>
        )}
      </div>
      
      <div className="notifications-tabs">
        <button 
          className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All Notifications
        </button>
        <button 
          className={`notification-tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => handleTabChange('unread')}
        >
          Unread
          {unreadCount > 0 && (
            <span className="tab-badge">{unreadCount}</span>
          )}
        </button>
      </div>
      
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <i className="fas fa-bell-slash"></i>
            <h4>No notifications</h4>
            <p>
              {activeTab === 'unread' 
                ? 'All caught up! No unread notifications.' 
                : 'You have no notifications at the moment.'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
            >
              {/* <div className="notification-icon">
                <i className={getNotificationIcon(notification.title)}></i>
              </div> */}
              
              <div className="notification-body">
                <div className="notification-header-content">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {formatDate(notification.created_at)}
                  </span>
                  {!notification.is_read && (
                    <div className="unread-dot"></div>
                  )}
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                {!notification.is_read && (
                  <div className="notification-actions">
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserNotifications;