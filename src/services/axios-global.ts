import { AppStore } from "@store/index";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";
let store: AppStore; // Reference to the Redux store

export const setStore = (s: AppStore) => {
  store = s;
};

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
});

// Request Interceptor
const requestInterceptor = (config:InternalAxiosRequestConfig) => {
  const token = store.getState().Authslice.jwt;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// Response Interceptor
const responseInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };


  // Check if the error is a 401, if we haven't retried yet, AND if the failed request was NOT the refresh endpoint itself.
  if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/refresh") {

    
    originalRequest._retry = true; // Mark that we are attempting a retry
    
    try {
      console.log("Access token expired. Attempting to refresh...");
      const refreshResponse = await api.post("/refresh");
      
      // In your Thunk, you used response.data, but here you might need to access the property directly
      const newAccessToken = refreshResponse.data.accessToken; 

      // Dispatch the action to update the token in Redux
      // Using imported actions is safer than string literals

      store.dispatch({ type: "AuthSlice/setAccessToken", payload: newAccessToken });
      // Update the authorization header of the original request
      if(originalRequest.headers){
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

// Attach interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((response) => response, responseInterceptor);

export default api;