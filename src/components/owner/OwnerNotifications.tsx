import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@store/index"; 
import { useNotifications } from "@hooks/useNotifications";

type OwnerNotificationsProps = {
  userId: number;
};

export default function OwnerNotifications({ userId }: OwnerNotificationsProps) {
  useNotifications(userId);

  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-3 rounded-lg shadow bg-white border hover:bg-gray-50"
            >
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
