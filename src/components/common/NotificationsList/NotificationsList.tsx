import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/index";
import { clearNotifications } from "@store/Noifications/notificationsSlice";
import { toast } from "react-toastify";
import { useNotifications } from "@hooks/useNotifications";

const NotificationList = ({ userId }: { userId: number | null }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );
  const toastedIds = useRef(new Set<number>());

  // 🔔 Subscribe to notifications via Echo
  useNotifications(userId);

  // 🎯 Show toast for new notifications only
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!toastedIds.current.has(notification.id)) {
        toast.success(notification.message);
        toastedIds.current.add(notification.id);
      }
    });
  }, [notifications]);

  const handleClearAll = () => {
    dispatch(clearNotifications());
    toastedIds.current.clear();
  };

  return (
    <div>
      {/* Render only the latest 3 notifications */}
      {notifications.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Recent Notifications</h4>
            <button onClick={handleClearAll}>Clear All</button>
          </div>
          <ul>
            {notifications.slice(0, 3).map((n) => (
              <li key={n.id}>{n.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationList