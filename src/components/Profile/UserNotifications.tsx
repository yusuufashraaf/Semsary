import  { useState, useEffect } from "react";
import { fetchUserNotifications, markNotificationAsRead } from "@services/axios-global";
import { useNotifications } from "@hooks/useNotifications";
import { TFullUser } from "src/types/users/users.types";

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

const UserNotifications = ({ user }: { user: TFullUser }) => {
  const [activeTab, setActiveTab] = useState<NotificationType>("all");
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
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
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

  const getNotificationIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("booking")) return "fas fa-calendar-check";
    if (lower.includes("payment")) return "fas fa-credit-card";
    if (lower.includes("rent")) return "fas fa-home";
    if (lower.includes("offer")) return "fas fa-file-contract";
    return "fas fa-bell";
  };

  const filtered = notifications.filter((n) =>
    activeTab === "unread" ? !n.is_read : true
  );
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleTabChange("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${activeTab === "unread" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleTabChange("unread")}
        >
          Unread {unreadCount > 0 && <span>({unreadCount})</span>}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((n) => (
            <li
              key={n.id}
              className={`p-3 rounded-lg border ${!n.is_read ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${getNotificationIcon(n.title)} text-blue-600`} />
                  <div>
                    <h3 className="font-medium">{n.title}</h3>
                    <p className="text-sm text-gray-600">{n.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(n.created_at)}</span>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-2 text-sm text-blue-600 underline"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;
