import { useState, useCallback } from "react";
import {
  Checkout,
  CheckoutAction,
  CheckoutStats,
  CheckoutQuery,
  CheckoutResponse,
  Transaction,
} from "src/types";
import { LaravelPaginatedResponse } from "src/types/index";
import {
  processCheckout,
  getCheckoutStatus,
  getCheckoutDetails,
  getUserCheckouts,
  checkouts,
  getCheckoutStats,
  getTransactions,
  autoConfirmExpiredCheckouts,
  handleAgentDecision,
} from "@services/checkoutService";
import { useAppSelector } from "@store/hook";

interface UseCheckoutsReturn {
  // State
  userCheckouts: Checkout[];
  adminCheckouts: Checkout[];
  userPagination: LaravelPaginatedResponse<Checkout> | null;
  adminPagination: LaravelPaginatedResponse<Checkout> | null;
  currentCheckout: Checkout | null;
  checkoutDetails: Checkout | null;
  stats: CheckoutStats | null;
  transactions: Transaction[];
  transactionsPagination: LaravelPaginatedResponse<Transaction> | null;
  walletBalance: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  requestCheckout: (rentRequestId: number, reason?: string) => Promise<CheckoutResponse | null>;
  makeAgentDecision: (rentRequestId: number, decision: Partial<CheckoutAction>) => Promise<CheckoutResponse | null>;
  ownerConfirm: (rentRequestId: number, damageNotes?: string) => Promise<CheckoutResponse | null>;
  ownerReject: (rentRequestId: number, damageNotes: string) => Promise<CheckoutResponse | null>;
  adminOverride: (rentRequestId: number, decision: Partial<CheckoutAction>) => Promise<CheckoutResponse | null>;
  fetchCheckoutStatus: (rentRequestId: number) => Promise<CheckoutResponse | null>;
  fetchCheckoutDetails: (checkoutId: number) => Promise<CheckoutResponse | null>;
  fetchUserCheckouts: (query?: CheckoutQuery) => Promise<void>;
  fetchAdminCheckouts: (query?: CheckoutQuery) => Promise<void>;
  fetchCheckoutStats: () => Promise<CheckoutStats | null>;
  fetchTransactions: (query?: CheckoutQuery) => Promise<void>;
  triggerAutoConfirm: () => Promise<{ total_expired: number; confirmed: number } | null>;
  clearError: () => void;
  resetState: () => void;
  
  // Legacy compatibility
  userTotal: number;
  adminTotal: number;
}

export const useCheckouts = (userId: number | null): UseCheckoutsReturn => {
  const [userCheckouts, setUserCheckouts] = useState<Checkout[]>([]);
  const [adminCheckouts, setAdminCheckouts] = useState<Checkout[]>([]);
  const [userPagination, setUserPagination] = useState<LaravelPaginatedResponse<Checkout> | null>(null);
  const [adminPagination, setAdminPagination] = useState<LaravelPaginatedResponse<Checkout> | null>(null);
  const [currentCheckout, setCurrentCheckout] = useState<Checkout | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<Checkout | null>(null);
  const [stats, setStats] = useState<CheckoutStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsPagination, setTransactionsPagination] = useState<LaravelPaginatedResponse<Transaction> | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get JWT from Redux store
  const { jwt } = useAppSelector((state) => state.Authslice);

  // Validate authentication
  const validateAuth = useCallback((): boolean => {
    if (!userId) {
      setError("User not logged in. Please log in to continue.");
      return false;
    }
    if (!jwt) {
      setError("Authorization token missing. Please log in again.");
      return false;
    }
    return true;
  }, [userId, jwt]);

  // Handle errors consistently
  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const message = error?.response?.data?.message || error?.message || defaultMessage;
    setError(message);
  }, []);

  // Request checkout
  const requestCheckout = useCallback(
    async (rentRequestId: number, reason?: string): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const action: CheckoutAction = {
          action: 'request_checkout',
          reason,
        };
        const response = await processCheckout(rentRequestId, action, jwt!);
        
        if (response.data?.checkout) {
          setCurrentCheckout(response.data.checkout);
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error requesting checkout.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Make agent decision
  const makeAgentDecision = useCallback(
    async (rentRequestId: number, decision: Partial<CheckoutAction>): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const action: CheckoutAction = {
          action: 'agent_decision',
          ...decision,
        };
const response = await handleAgentDecision(rentRequestId, decision, jwt!);
        
        if (response.data?.checkout) {
          setCurrentCheckout(response.data.checkout);
          // Update local state
          setUserCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
          setAdminCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error making agent decision.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Owner confirm
  const ownerConfirm = useCallback(
    async (rentRequestId: number, damageNotes?: string): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const action: CheckoutAction = {
          action: 'owner_confirm',
          damage_notes: damageNotes,
        };
        const response = await processCheckout(rentRequestId, action, jwt!);
        
        if (response.data?.checkout) {
          setCurrentCheckout(response.data.checkout);
          // Update local state
          setUserCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
          setAdminCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error confirming checkout.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Owner reject
  const ownerReject = useCallback(
    async (rentRequestId: number, damageNotes: string): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const action: CheckoutAction = {
          action: 'owner_reject',
          damage_notes: damageNotes,
        };
        const response = await processCheckout(rentRequestId, action, jwt!);
        
        if (response.data?.checkout) {
          setCurrentCheckout(response.data.checkout);
          // Update local state
          setUserCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
          setAdminCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error rejecting checkout.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Admin override
  const adminOverride = useCallback(
    async (rentRequestId: number, decision: Partial<CheckoutAction>): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const action: CheckoutAction = {
          action: 'admin_override',
          ...decision,
        };
        const response = await processCheckout(rentRequestId, action, jwt!);
        
        if (response.data?.checkout) {
          setCurrentCheckout(response.data.checkout);
          // Update local state
          setAdminCheckouts(prev => 
            prev.map(checkout => 
              checkout.rent_request_id === rentRequestId 
                ? response.data!.checkout 
                : checkout
            )
          );
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error applying admin override.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch checkout status
  const fetchCheckoutStatus = useCallback(
    async (rentRequestId: number): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await getCheckoutStatus(rentRequestId, jwt!);
        
        if (response.data?.checkout) {
          setCurrentCheckout(response.data.checkout);
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error fetching checkout status.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch checkout details
  const fetchCheckoutDetails = useCallback(
    async (checkoutId: number): Promise<CheckoutResponse | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await getCheckoutDetails(checkoutId, jwt!);
        
        if (response.data?.checkout) {
          setCheckoutDetails(response.data.checkout);
        }
        
        return response;
      } catch (err: any) {
        handleError(err, "Error fetching checkout details.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch user checkouts
  const fetchUserCheckouts = useCallback(
    async (query: CheckoutQuery = {}): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getUserCheckouts(jwt!, query);
        setUserCheckouts(response.data);
        setUserPagination(response);
      } catch (err: any) {
        handleError(err, "Error fetching user checkouts.");
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch admin checkouts
  const fetchAdminCheckouts = useCallback(
    async (query: CheckoutQuery = {}): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await checkouts(jwt!, query);
        setAdminCheckouts(response.data);
        setAdminPagination(response);
      } catch (err: any) {
        handleError(err, "Error fetching admin checkouts.");
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch checkout stats
  const fetchCheckoutStats = useCallback(
    async (): Promise<CheckoutStats | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const statsData = await getCheckoutStats(jwt!);
        setStats(statsData);
        return statsData;
      } catch (err: any) {
        handleError(err, "Error fetching checkout statistics.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (query: CheckoutQuery = {}): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getTransactions(jwt!, query);
        setTransactions(response.data);
        setTransactionsPagination(response);
        setWalletBalance(response.wallet_balance);
      } catch (err: any) {
        handleError(err, "Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Trigger auto-confirm
  const triggerAutoConfirm = useCallback(
    async (): Promise<{ total_expired: number; confirmed: number } | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const result = await autoConfirmExpiredCheckouts(jwt!);
        return result;
      } catch (err: any) {
        handleError(err, "Error triggering auto-confirm.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setUserCheckouts([]);
    setAdminCheckouts([]);
    setUserPagination(null);
    setAdminPagination(null);
    setCurrentCheckout(null);
    setCheckoutDetails(null);
    setStats(null);
    setTransactions([]);
    setTransactionsPagination(null);
    setWalletBalance("0");
    setError(null);
  }, []);

  return {
    // State
    userCheckouts,
    adminCheckouts,
    userPagination,
    adminPagination,
    currentCheckout,
    checkoutDetails,
    stats,
    transactions,
    transactionsPagination,
    walletBalance,
    loading,
    error,
    
    // Actions
    requestCheckout,
    makeAgentDecision,
    ownerConfirm,
    ownerReject,
    adminOverride,
    fetchCheckoutStatus,
    fetchCheckoutDetails,
    fetchUserCheckouts,
    fetchAdminCheckouts,
    fetchCheckoutStats,
    fetchTransactions,
    triggerAutoConfirm,
    clearError,
    resetState,
    
    // Legacy compatibility
    userTotal: userPagination?.total || 0,
    adminTotal: adminPagination?.total || 0,
  };
};