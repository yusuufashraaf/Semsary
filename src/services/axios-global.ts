import { AppStore } from "@store/index";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";
let store: AppStore; // Reference to the Redux store

export const setStore = (s: AppStore) => {
  store = s;
};

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
      const newAccessToken = refreshResponse.data.accessToken;

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
    console.error('Error fetching reviews:', error);
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

// Attach interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((response) => response, responseInterceptor);

export default api;
