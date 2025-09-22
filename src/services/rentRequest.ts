import axios from "axios";
import { RentRequest } from "src/types";
import {  LaravelPaginatedResponse,
  RentRequestQuery,
  CreateRentRequestData,
  PaymentData,
  RequestStats,
} from "src/types/index"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Utility function to handle errors globally
const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    // Handle axios specific errors (e.g., network errors, response errors)
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    // Handle non-axios errors
    console.error("Unexpected Error:", error);
  }
  throw error; 
};

// Fetch Rent Requests for a User
export const getUserRentRequests = async (
  jwt: string,
  query: RentRequestQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<RentRequest>> => {
  try {
    const response = await API.get<{
      success: boolean;
      message: string;
      data: LaravelPaginatedResponse<RentRequest>;
    }>(
      "/rent-requests/user",
      {
        params: query,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Fetch Rent Requests for an Owner
export const getOwnerRentRequests = async (
  jwt: string,
  query: RentRequestQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<RentRequest>> => {
  try {
    const response = await API.get<{
      success: boolean;
      message: string;
      data: LaravelPaginatedResponse<RentRequest>;
    }>(
      "/rent-requests/owner",
      {
        params: query,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get Rent Request Details
export const getRentRequestDetails = async (
  requestId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<RentRequest> => {
  try {
    const response = await API.get<RentRequest>(`/rent-requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get Rent Request Statistics
export const getRentRequestStats = async (
  jwt: string,
  signal?: AbortSignal
): Promise<RequestStats> => {
  try {
    const response = await API.get<RequestStats>("/rent-requests/stats", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Create a Rent Request
export const createRentRequest = async (
  data: CreateRentRequestData,
  jwt: string,
  signal?: AbortSignal
): Promise<RentRequest> => {
  try {
    const response = await API.post<RentRequest>("/rent-requests", data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cancel Rent Request by User 
export const cancelRentRequestByUser = async (
  requestId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<void> => {
  try {
    await API.post(`/rent-requests/${requestId}/cancel`, {}, { 
      headers: {
        Authorization: `Bearer ${jwt}`, 
      },
      signal 
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Confirm Rent Request by Owner
export const confirmRentRequestByOwner = async (
  requestId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<void> => {
  try {
    await API.post(`/rent-requests/${requestId}/confirm`, {}, { 
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal 
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Reject Rent Request by Owner
export const rejectRentRequestByOwner = async (
  requestId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<void> => {
  try {
    await API.post(`/rent-requests/${requestId}/reject`, {}, { 
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal 
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cancel Confirmed Request by Owner
export const cancelConfirmedByOwner = async (
  requestId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<void> => {
  try {
    await API.post(`/rent-requests/${requestId}/cancel-by-owner`, {}, { 
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal 
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Pay for Rent Request
export const payForRequest = async (
  requestId: number,
  paymentData: PaymentData,
  jwt: string,
  signal?: AbortSignal
): Promise<any> => {
  try {
    const response = await API.post(`/rent-requests/${requestId}/pay`, paymentData, { 
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal 
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};