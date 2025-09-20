import { useEffect, useState } from "react";
import { getEcho } from "../services/echoManager";

type RentNotification = {
  id: number;
  message: string;
  property_id?: number;
};

type NotificationPayload = {
  id: string;
  type: string;
  notifiable_id: number;
  notifiable_type: string;
  data: RentNotification;
};

export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<RentNotification[]>([]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const echo = getEcho();
    if (!echo) return;

    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel.notification((notification: NotificationPayload | any) => {
      const data: RentNotification = notification.data ?? notification;
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId]);

  return notifications;
}
