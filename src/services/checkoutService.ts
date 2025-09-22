import axios from "axios";
import { 
  Checkout, 
  CheckoutAction, 
  CheckoutStats, 
  CheckoutQuery, 
  CheckoutResponse, 
  Transaction 
} from "src/types";
import { LaravelPaginatedResponse } from "src/types/index";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Utility function to handle errors globally
const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
  throw error;
};

// Process checkout action
export const processCheckout = async (
  rentRequestId: number,
  action: CheckoutAction,
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutResponse> => {
  try {
    const response = await API.post<CheckoutResponse>(
      `/checkout/${rentRequestId}`,
      action,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get checkout status for a rental
export const getCheckoutStatus = async (
  rentRequestId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutResponse> => {
  try {
    const response = await API.get<CheckoutResponse>(
      `/checkout/${rentRequestId}/status`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get checkout details by checkout ID
export const getCheckoutDetails = async (
  checkoutId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutResponse> => {
  try {
    const response = await API.get<CheckoutResponse>(
      `/checkout/details/${checkoutId}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// List user's checkouts (paginated)
export const getUserCheckouts = async (
  jwt: string,
  query: CheckoutQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<Checkout>> => {
  try {
    const response = await API.get<LaravelPaginatedResponse<Checkout>>(
      "/checkout/user",
      {
        params: query,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// List all checkouts for admin view
export const getAdminCheckouts = async (
  jwt: string,
  query: CheckoutQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<Checkout>> => {
  try {
    const response = await API.get<LaravelPaginatedResponse<Checkout>>(
      "/checkout/admin",
      {
        params: query,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Get checkout statistics for dashboard
export const getCheckoutStats = async (
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutStats> => {
  try {
    const response = await API.get<CheckoutStats>(
      "/checkout/stats",
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// List all transactions
export const getTransactions = async (
  jwt: string,
  query: CheckoutQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<Transaction> & { wallet_balance: string }> => {
  try {
    const response = await API.get<
      LaravelPaginatedResponse<Transaction> & { wallet_balance: string }
    >("/checkout/transactions", {
      params: query,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Auto-confirm expired checkouts (admin only)
export const autoConfirmExpiredCheckouts = async (
  jwt: string,
  signal?: AbortSignal
): Promise<{ total_expired: number; confirmed: number }> => {
  try {
    const response = await API.post<{
      success: boolean;
      data: { total_expired: number; confirmed: number };
    }>(
      "/checkout/auto-confirm",
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        signal,
      }
    );
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};