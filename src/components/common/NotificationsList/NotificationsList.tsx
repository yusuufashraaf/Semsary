import { useEffect, useRef } from "react";
import {  useSelector } from "react-redux";
import { RootState } from "@store/index";
import { useNotifications } from "@hooks/useNotifications";

const NotificationList = ({ userId }: { userId: number | null }) => {
  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );
  const toastedIds = useRef(new Set<number>());

  // Subscribe to notifications via Echo
  useNotifications(userId);

  // Show toast for new notifications only
  useEffect(() => {
    notifications.forEach((notification) => {
      if (!toastedIds.current.has(Number(notification.id))) {
        toastedIds.current.add(Number(notification.id));
      }
    });
  }, [notifications]);


  return (
<></>
  );
};

export default NotificationList