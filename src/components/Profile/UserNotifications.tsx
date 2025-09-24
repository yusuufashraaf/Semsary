import { useState, useEffect } from "react";
import { fetchUserNotifications, markNotificationAsRead } from "@services/axios-global";
import { useNotifications } from "@hooks/useNotifications";
import { TFullUser } from "src/types/users/users.types";
import "./UserNotifications.css";
import Loader from "@components/common/Loader/Loader";
import { useAppSelector } from "@store/hook";

// Define proper types
type NotificationType = "all" | "unread";

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

const UserNotifications = ({
  onUnreadCountChange,
}: {
  users?: TFullUser;
  onUnreadCountChange?: (count: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState<NotificationType>("all"); // Fixed type
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppSelector(state => state.Authslice);

  // Debug: Check if user is available
  useEffect(() => {
    console.log("User from Redux:", user);
    console.log("User ID:", user?.id);
  }, [user]);

  // 🔌 Subscribe to WebSocket
  // /useNotifications(user?.id);

  useEffect(() => {
    const getNotificationsData = async () => {
      console.log("🔄 useEffect triggered - Fetching notifications for user ID:", user?.id);
      
      // Check if user exists and has an ID
      if (!user?.id) {
        console.log("❌ No user ID available");
        setLoading(false);
        setError("User not available");
        return;
      }

      try {
        console.log("✅ Starting to fetch notifications...");
        setLoading(true);
        setError(null);
        const data = await fetchUserNotifications(user.id);
        console.log("📨 Fetched notifications data:", data);
        setNotifications(data || []); // Ensure it's always an array
        console.log("✅ Notifications state updated");
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
        setError("Failed to fetch notifications");
      } finally {
        console.log("🏁 Loading set to false");
        setLoading(false);
      }
    };

    getNotificationsData();
  }, [user?.id]);

  const handleTabChange = (tab: any) => {
    console.log("Tab changed to:", tab);
    setActiveTab(tab);
  };

  const markAsRead = async (id: number) => {
    console.log("Marking notification as read:", id);
    if (!user?.id) {
      console.log("❌ No user ID for markAsRead");
      return;
    }

    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
      
      const $response = await markNotificationAsRead(user.id, id);
      //console.log($read);
      console.log("✅ Notification marked as read successfully" + $response.data);
    } catch (err) {
      // Revert on error
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, is_read: false } : notification
        )
      );
      console.error("❌ Error marking notification as read:", err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getNotificationIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("booking")) return "fas fa-calendar-check";
    if (lower.includes("payment")) return "fas fa-credit-card";
    if (lower.includes("rent")) return "fas fa-home";
    if (lower.includes("offer")) return "fas fa-file-contract";
    return "fas fa-bell";
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    console.log("Unread count updated:", unreadCount);
    onUnreadCountChange?.(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  // Debug current state
  console.log("=== CURRENT STATE ===");
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Total notifications:", notifications.length);
  console.log("Unread count:", unreadCount);
  console.log("Filtered notifications:", filteredNotifications.length);
  console.log("Active tab:", activeTab);
  console.log("=====================");

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="notifications-container">
        <div className="loading-state">
          <Loader message="Loading notifications..." />
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="notifications-container">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering notifications list");
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
          className={`notification-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Notifications
        </button>
        <button
          className={`notification-tab ${activeTab === "unread" ? "active" : ""}`}
          onClick={() => handleTabChange("unread")}
        >
          Unread
          {unreadCount > 0 && <span className="tab-badge">{unreadCount}</span>}
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <i className="fas fa-bell-slash"></i>
            <h4>No notifications</h4>
            <p>
              {activeTab === "unread"
                ? "All caught up! No unread notifications."
                : "You have no notifications at the moment."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.is_read ? "unread" : ""}`}
            >
              {/* <div className="notification-icon">
                <i className={getNotificationIcon(notification.title)}></i>
              </div> */}
              <div className="notification-body">
                <div className="notification-header-content">
                  <h4 className="notification-title">{notification.type}</h4>
                  <span className="notification-time">
                    {formatDate(notification.created_at)}
                  </span>
                  {!notification.is_read && <div className="unread-dot"></div>}
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