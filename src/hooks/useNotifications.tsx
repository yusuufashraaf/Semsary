import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getEcho } from "../services/echoManager";
import { addNotification } from "../store/Noifications/notificationsSlice";
import { toast } from "react-toastify"; 
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
      const formatted = {
        id: data.id,
        user_id: userId!,
        title: "New Notification", 
        message: data.message,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        property_id: data.property_id,
      };
      dispatch(addNotification(formatted));
      toast.info(data.message, {
        position: "top-right",
        autoClose: 3000,
        });
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId, dispatch]);
}