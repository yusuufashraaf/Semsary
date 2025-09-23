import { useEffect, useState } from "react";
import { getNotifications, Notification } from "@services/Notifications";

export function useFetchNotifications(page: number = 1, perPage: number = 10) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, current_page: 1, last_page: 1 });

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getNotifications(page, perPage, controller.signal);
        setNotifications(res.data);
        setPagination({ total: res.total, current_page: res.current_page, last_page: res.last_page });
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [page, perPage]);

  return { notifications, loading, error, pagination };
}
