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

// Global error handler
const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
  throw error;
};

// ----------------- CHECKOUTS -----------------

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
        headers: { Authorization: `Bearer ${jwt}` },
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
      `/checkout/${rentRequestId}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
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
      `/checkouts/${checkoutId}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ----------------- DECISION ACTIONS -----------------

// Agent decision (approve/reject)
export const handleAgentDecision = async (
    checkoutId: number,
  decision: {
    deposit_return_percent?: number;
    rent_returned?: boolean;
    notes?: string;
  },
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutResponse> => {
  try {
    const response = await API.post<CheckoutResponse>(
      `/checkout/${checkoutId}/agent-decision`,
      decision,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Owner confirm
export const handleOwnerConfirm = async (
  checkoutId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutResponse> => {
  try {
    const response = await API.post<CheckoutResponse>(
      `/checkout/${checkoutId}/owner/confirm`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Owner reject
export const handleOwnerReject = async (
  checkoutId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutResponse> => {
  try {
    const response = await API.post<CheckoutResponse>(
      `/checkout/${checkoutId}/owner/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ----------------- LISTS -----------------

// List user's checkouts (paginated)
export const getUserCheckouts = async (
  jwt: string,
  query: CheckoutQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<Checkout>> => {
  try {
    const response = await API.get<LaravelPaginatedResponse<Checkout>>(
      "/checkouts/user",
      {
        params: query,
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// List all checkouts for admin view
export const checkouts = async (
  jwt: string,
  query: CheckoutQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<Checkout>> => {
  try {
    const response = await API.get<LaravelPaginatedResponse<Checkout>>(
      "/checkouts/all",
      {
        params: query,
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ----------------- DASHBOARD -----------------

// Get checkout statistics for dashboard
export const getCheckoutStats = async (
  jwt: string,
  signal?: AbortSignal
): Promise<CheckoutStats> => {
  try {
    const response = await API.get<CheckoutStats>(
      "/checkouts/stats",
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ----------------- TRANSACTIONS -----------------

// List all transactions
export const getTransactions = async (
  jwt: string,
  query: CheckoutQuery = {},
  signal?: AbortSignal
): Promise<LaravelPaginatedResponse<Transaction> & { wallet_balance: string }> => {
  try {
    const response = await API.get<
      LaravelPaginatedResponse<Transaction> & { wallet_balance: string }
    >("/checkouts/transactions", {
      params: query,
      headers: { Authorization: `Bearer ${jwt}` },
      signal,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ----------------- ADMIN ACTIONS -----------------

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
      "/system/auto-confirm-checkouts",
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
};
