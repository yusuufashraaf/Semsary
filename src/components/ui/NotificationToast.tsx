import React from "react";
import { useNotifications } from "@store/admin/adminStore";
import { cn } from "@utils/classNames";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const iconMap = {
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  error: XCircleIcon,
};

const colorMap = {
  success:
    "bg-success-50 border-success-200 text-success-800 dark:bg-success-900/50 dark:border-success-800 dark:text-success-200",
  warning:
    "bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-200",
  info: "bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-200",
  error:
    "bg-danger-50 border-danger-200 text-danger-800 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-200",
};

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];

        return (
          <div
            key={notification.id}
            className={cn(
              "rounded-lg border p-4 shadow-lg transition-all duration-300 animate-slide-down",
              colorMap[notification.type]
            )}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="mt-1 text-sm opacity-90">
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="inline-flex rounded-md p-1.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
