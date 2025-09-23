import axios from "axios";
import {
  PropertyPurchase,
  PropertyEscrow,
  Wallet,
} from "src/types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ---------------- Utility ----------------

/**
 * Handle all API errors consistently.
 */
const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
  throw error;
};

// ---------------- Types ----------------
export interface CancelResponse {
  success: boolean;
  message: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase: PropertyPurchase;
    escrow: PropertyEscrow;
    property: any;
    seller: any;
  };
}

export interface TransactionsResponse {
  success: boolean;
  data: {
    wallet: Wallet;
    purchases: PropertyPurchase[];
    escrows: PropertyEscrow[];
    rents: any[];
  };
}

export interface UserPurchasesResponse {
  success: boolean;
  message: string;
  data: {
    purchases: PropertyPurchase[];
    count: number;
  };
}

export interface PropertyPurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase: PropertyPurchase;
  };
}

// ---------------- API Calls ----------------

/**
 * Pay for a property (creates purchase + escrow).
 */
export const payForProperty = async (
  propertyId: number,
  payload: {
    expected_total: number;
    idempotency_key?: string;
    payment_method_token?: string;
  },
  jwt: string,
  signal?: AbortSignal
): Promise<PurchaseResponse> => {
  try {
    const response = await API.post<PurchaseResponse>(
      `/properties/${propertyId}/purchase`,
      payload,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Cancel an existing property purchase (refunds buyer).
 * Must pass the PURCHASE ID (not property id).
 */
export const cancelPurchase = async (
  purchaseId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<CancelResponse> => {
  try {
    const response = await API.post<CancelResponse>(
      `/purchases/${purchaseId}/cancel`,
      {},
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Fetch all transactions for the current user
 * (wallet, purchases, escrows, rents).
 */
export const getAllTransactions = async (
  jwt: string,
  signal?: AbortSignal
): Promise<TransactionsResponse> => {
  try {
    const response = await API.get<TransactionsResponse>(
      `/transactions`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * NEW: Get user's purchases only
 */
export const getUserPurchases = async (
  jwt: string,
  signal?: AbortSignal
): Promise<UserPurchasesResponse> => {
  try {
    const response = await API.get<UserPurchasesResponse>(
      `/user/purchases`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * NEW: Get user's purchase for a specific property
 */
export const getUserPurchaseForProperty = async (
  propertyId: number,
  jwt: string,
  signal?: AbortSignal
): Promise<PropertyPurchaseResponse> => {
  try {
    const response = await API.get<PropertyPurchaseResponse>(
      `/properties/${propertyId}/purchase`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// ---------------- Example Flow ----------------

/**
 * Example helper: Pay then cancel immediately (for testing).
 * Ensures cancelPurchase uses the correct purchase.id
 */
export const purchaseAndMaybeCancel = async (
  propertyId: number,
  payload: { expected_total: number },
  jwt: string,
  cancel = false
) => {
  // 1. Create the purchase
  const purchaseResponse = await payForProperty(propertyId, payload, jwt);
  const purchaseId = purchaseResponse.data.purchase.id;

  // 2. Cancel if requested
  if (cancel) {
    const cancelResponse = await cancelPurchase(purchaseId, jwt);
    return { purchaseResponse, cancelResponse };
  }

  return { purchaseResponse };
};