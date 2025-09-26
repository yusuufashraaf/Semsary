import { AppStore } from "@store/index";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";
import { Chat, CreateReviewData, Message, Review } from "src/types";

let store: AppStore; // Reference to the Redux store

export const setStore = (s: AppStore) => {
  store = s;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const publicApiEndpoints = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-reset-token",
];

// Request Interceptor
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = store.getState().Authslice.jwt;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

// Response Interceptor
const responseInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (
    error.response?.status === 401 &&
    !originalRequest._retry &&
    originalRequest.url !== "/refresh"
  ) {
    const isPublicEndpoint = publicApiEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // FIX: send the old token in refresh request
      const oldToken = store.getState().Authslice.jwt;

      const refreshResponse = await api.post(
        "/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${oldToken}`,
          },
        }
      );

      const newAccessToken = refreshResponse.data.access_token;

      store.dispatch({
        type: "AuthSlice/setAccessToken",
        payload: newAccessToken,
      });

      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch {
      store.dispatch({ type: "AuthSlice/logOut" });
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
};

// -------- Services --------

export const fetchUserReviews = async (userId: number) => {
  const response = await api.get(`/user/${userId}/reviews`);
  return response.data;
};

export const fetchUserProperties = async (userId: number) => {
  const response = await api.get(`/user/${userId}/properties`);
  return response.data;
};

export const fetchUserNotifications = async (userId: number) => {
  const response = await api.get(`/user/${userId}/notifications`);
  return response.data;
};

export const fetchUserPurchases = async (userId: number) => {
  const response = await api.get(`/user/${userId}/purchases`);
  return response.data;
};

export const fetchUserBookings = async (userId: number) => {
  const response = await api.get(`/user/${userId}/bookings`);
  return response.data;
};

export const fetchUserWishlists = async (userId: number) => {
  const response = await api.get(`/user/${userId}/wishlists`);
  return response.data;
};

export const markNotificationAsRead = async (
  userId: number,
  notificationId: number
) => {
  const response = await api.patch(`/user/${userId}/notifications/${notificationId}/read`);
  return response;
};

export const messageService = {
  getUserChats: async (userId: number): Promise<{ chats: any[] }> => {
    const response = await api.get("/fetch-chats/" + userId);
    return response.data;
  },

  getChatMessages: async (
    chatId: number
  ): Promise<{ messages: Message[] }> => {
    const response = await api.get(`/fetch-messages/${chatId}`);
    return response.data;
  },

  getAvailableNewChats: async (
    userId: number
  ): Promise<{ properties: any[] }> => {
    const response = await api.get(`/fetch-available-chats/${userId}`);
    return response.data;
  },

  startChat: async (
    propertyId: number,
    ownerId: number,
    renterId: number
  ): Promise<{ chat: Chat }> => {
    const response = await api.post("user/chats/start", {
      property_id: propertyId,
      owner_id: ownerId,
      renter_id: renterId,
    });
    return response.data;
  },

  markAsRead: async (chatId: number): Promise<void> => {
    await api.post(`user/chats/${chatId}/read`);
  },
};

export const reviewService = {
  createReview: async (
    reviewData: CreateReviewData
  ): Promise<{ review: Review }> => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  getReviewableProperties: async (): Promise<{ properties: any[] }> => {
    const response = await api.get("/user/reviewable-properties");
    return response.data;
  },

  getPropertyReviews: async (
    propertyId: number
  ): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/properties/${propertyId}/reviews`);
    return response.data;
  },

  getUserReviews: async (
    userId: number
  ): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/users/${userId}/reviews`);
    return response.data;
  },

  deleteReview: (reviewId: number): Promise<void> => {
    return api.delete(`/reviews/${reviewId}`);
  },

  updateReview: async (
    reviewId: number,
    reviewData: Partial<Review>
  ): Promise<{ review: Review }> => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },
};

// Attach interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((response) => response, responseInterceptor);

export default api;
