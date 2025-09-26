// hooks/useNotifications.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getEcho } from "../services/echoManager";
import { addNotification } from "../store/Noifications/notificationsSlice";

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
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel.notification((notification: NotificationPayload | any) => {
      console.log("Received notification:", notification);
      const data: RentNotification = notification.data ?? notification;
      dispatch(addNotification(data));
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId, dispatch]);
}