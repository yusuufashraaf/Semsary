import api from "@services/axios-global";

export type Notification = {
  id: number;
  purpose: string;
  label: string;
  requires_action: boolean;
  priority: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  property?: {
    id: number;
    title: string;
    price_per_night: number;
    owner_id: number;
  };
};

// Get notifications for logged-in user
export const getNotifications = async (
  page: number = 1,
  perPage: number = 10,
  signal?: AbortSignal
): Promise<{ data: Notification[]; total: number; current_page: number; last_page: number }> => {
  const response = await api.get(`/notifications?page=${page}&per_page=${perPage}`, { signal });
  return {
    data: response.data.notifications.data,
    total: response.data.total,
    current_page: response.data.notifications.current_page,
    last_page: response.data.notifications.last_page,
  };
};

// Mark a notification as read
export const markAsRead = async (id: number) => {
  const response = await api.post(`/notifications/${id}/read`);
  return response.data;
};
