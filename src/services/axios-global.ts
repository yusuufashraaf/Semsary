import { AppStore } from "@store/index";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";
import { Chat, CreateReviewData, Message, Property, Review } from "src/types";
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

  // Check if the error is a 401, if we haven't retried yet, AND if the failed request was NOT the refresh endpoint itself.
  if (
    error.response?.status === 401 &&
    !originalRequest._retry &&
    originalRequest.url !== "/refresh"
  ) {
    const isPublicEndpoint = publicApiEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      console.log(
        `Request to public endpoint ${originalRequest.url} failed with 401. Rejecting without refresh.`
      );
      return Promise.reject(error);
    }
    originalRequest._retry = true; // Mark that we are attempting a retry

    try {
      console.log("Access token expired. Attempting to refresh...");
      const refreshResponse = await api.post("/refresh");

      // In your Thunk, you used response.data, but here you might need to access the property directly
      const newAccessToken = refreshResponse.data.access_token;

      // Dispatch the action to update the token in Redux
      // Using imported actions is safer than string literals

      store.dispatch({
        type: "AuthSlice/setAccessToken",
        payload: newAccessToken,
      });
      // Update the authorization header of the original request
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }

      // Retry the original request with the new token
      return api(originalRequest);
    } catch (refreshError) {
      console.error("Unable to refresh token. Logging out.");
      // If the refresh fails, dispatch the logout action
      store.dispatch({ type: "AuthSlice/logOut" });
      return Promise.reject(refreshError);
    }
  }

  // If the error is not a 401, or if it's the refresh endpoint failing, just reject.
  return Promise.reject(error);
};

export const fetchUserReviews = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}/reviews`);
    return response.data; // This will be your JSON data
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchUserProperties = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}/properties`);
    return response.data; // This will be your JSON data
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchUserNotifications = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}/notifications`);
    return response.data; // This will be your JSON data
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const fetchUserPurchases = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}/purchases`);
    return response.data; // This will be your JSON data
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchUserBookings = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}/bookings`);
    return response.data; // This will be your JSON data
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchUserWishlists = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}/wishlists`);
    return response.data; // This will be your JSON data
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (userId:number,notificationId:number) => {
  try {
    const response = await api.patch(`/user/${userId}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const messageService = {
  getUserChats: async (): Promise<{ chats: Chat[]; total_unread: number }> => {
    const response = await api.get('user/chats');
    return response.data;
  },

  getChatMessages: async (chatId: number): Promise<{ messages: Message[]; chat: Chat }> => {
    const response = await api.get(`user/chats/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId: number, content: string): Promise<{ message: Message; chat: Chat }> => {
    const response = await api.post(`user/chats/${chatId}/messages`, { content });
    return response.data;
  },

  startChat: async (propertyId: number, ownerId: number, renterId: number): Promise<{ chat: Chat }> => {
    const response = await api.post('user/chats/start', {
      property_id: propertyId,
      owner_id: ownerId,
      renter_id: renterId
    });
    return response.data;
  },

  markAsRead: async (chatId: number): Promise<void> => {
    await api.post(`user/chats/${chatId}/read`);
  }
};

export const reviewService = {
  // Create a new review
  createReview: async (reviewData: CreateReviewData): Promise<{ review: Review }> => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  getReviewableProperties: async (): Promise<{ properties: Property[] }> => {
    const response = await api.get('/user/reviewable-properties');
    console.log('Fetched reviewable properties:', response);
    return response.data;
  },

  // Get reviews for a property
  getPropertyReviews: async (propertyId: number): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/properties/${propertyId}/reviews`);
    return response.data;
  },

  // Get reviews by user
  getUserReviews: async (userId: number): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/users/${userId}/reviews`);
    return response.data;
  },

  deleteReview: (reviewId: number): Promise<void> => {
    return api.delete(`/reviews/${reviewId}`);
  },

  // Update a review
  updateReview: async (reviewId: number, reviewData: Partial<Review>): Promise<{ review: Review }> => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // // Delete a review
  // deleteReview: async (reviewId: number): Promise<void> => {
  //   await api.delete(`/reviews/${reviewId}`);
  // }
};

// Attach interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((response) => response, responseInterceptor);

export default api;
