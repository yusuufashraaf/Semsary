import { useState, useCallback } from "react";
import { RentRequest } from "src/types";
import {
  getUserRentRequests,
  getOwnerRentRequests,
  createRentRequest,
  cancelRentRequestByUser,
  confirmRentRequestByOwner,
  rejectRentRequestByOwner,
  cancelConfirmedByOwner,
  payForRequest,
  getRentRequestDetails,
  getRentRequestStats,
  getUnavailableDates, 
} from "@services/rentRequest";
import { useAppSelector } from "@store/hook";
import {
  LaravelPaginatedResponse,
  RentRequestQuery,
  CreateRentRequestData,
  PaymentData,
  RequestStats,
} from "src/types/index";

interface UseRentRequestsReturn {
  // State
  userRentRequests: RentRequest[];
  ownerRentRequests: RentRequest[];
  userPagination: LaravelPaginatedResponse<RentRequest> | null;
  ownerPagination: LaravelPaginatedResponse<RentRequest> | null;
  requestDetails: RentRequest | null;
  stats: RequestStats | null;
  unavailableDates: { start: string; end: string }[]; // 👈 NEW
  loading: boolean;
  error: string | null;

  // Actions
  fetchUserRentRequests: (query?: RentRequestQuery) => Promise<void>;
  fetchOwnerRentRequests: (query?: RentRequestQuery) => Promise<void>;
  fetchRequestDetails: (requestId: number) => Promise<RentRequest | null>;
  fetchRequestStats: () => Promise<RequestStats | null>;
  fetchUnavailableDates: (propertyId: number) => Promise<void>; // 👈 NEW
  createRequest: (data: CreateRentRequestData) => Promise<RentRequest | null>;
  cancelRequest: (requestId: number) => Promise<void>;
  confirmRequest: (requestId: number) => Promise<void>;
  rejectRequest: (requestId: number) => Promise<void>;
  cancelConfirmedRequest: (requestId: number) => Promise<void>;
  payForRentRequest: (requestId: number, paymentData: PaymentData) => Promise<any>;
  clearError: () => void;
  resetState: () => void;

  // Legacy compatibility
  userTotal: number;
  ownerTotal: number;
  cancelByOwnerRequest: (requestId: number) => Promise<void>;
}

export const useRentRequests = (userId: number | null): UseRentRequestsReturn => {
  const [userRentRequests, setUserRentRequests] = useState<RentRequest[]>([]);
  const [ownerRentRequests, setOwnerRentRequests] = useState<RentRequest[]>([]);
  const [userPagination, setUserPagination] =
    useState<LaravelPaginatedResponse<RentRequest> | null>(null);
  const [ownerPagination, setOwnerPagination] =
    useState<LaravelPaginatedResponse<RentRequest> | null>(null);
  const [requestDetails, setRequestDetails] = useState<RentRequest | null>(null);
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<
    { start: string; end: string }[]
  >([]); // 👈 NEW
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
    const message =
      error?.message || error?.response?.data?.message || defaultMessage;
    setError(message);
  }, []);

  // Fetch user rent requests
  const fetchUserRentRequests = useCallback(
    async (query: RentRequestQuery = {}): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getUserRentRequests(jwt!, query);
        setUserRentRequests(response.data);
        setUserPagination(response);
      } catch (err: any) {
        handleError(err, "Error fetching user rent requests.");
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch owner rent requests
  const fetchOwnerRentRequests = useCallback(
    async (query: RentRequestQuery = {}): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getOwnerRentRequests(jwt!, query);
        setOwnerRentRequests(Array.isArray(response.data) ? response.data : []);
        setOwnerPagination(response);
      } catch (err: any) {
        handleError(err, "Error fetching owner rent requests.");
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Get request details
  const fetchRequestDetails = useCallback(
    async (requestId: number): Promise<RentRequest | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const request = await getRentRequestDetails(requestId, jwt!);
        setRequestDetails(request);
        return request;
      } catch (err: any) {
        handleError(err, "Error fetching request details.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Get request stats
  const fetchRequestStats = useCallback(
    async (): Promise<RequestStats | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const statsData = await getRentRequestStats(jwt!);
        setStats(statsData);
        return statsData;
      } catch (err: any) {
        handleError(err, "Error fetching request statistics.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  //  Fetch unavailable dates
  const fetchUnavailableDates = useCallback(
    async (propertyId: number): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const dates = await getUnavailableDates(propertyId, jwt ?? undefined);
        const formatted = dates.map((d: { check_in: string; check_out: string }) => ({
        start: d.check_in,
        end: d.check_out,
      }));
        setUnavailableDates(formatted);
      } catch (err: any) {
        handleError(err, "Error fetching unavailable dates.");
      } finally {
        setLoading(false);
      }
    },
    [jwt, handleError]
  );

  // Create rent request
  const createRequest = useCallback(
    async (data: CreateRentRequestData): Promise<RentRequest | null> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const newRequest = await createRentRequest(data, jwt!);
        setUserRentRequests((prev) => [newRequest, ...prev]);
        return newRequest;
      } catch (err: any) {
        handleError(err, "Error creating rent request.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Cancel rent request (user)
  const cancelRequest = useCallback(
    async (requestId: number): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        await cancelRentRequestByUser(requestId, jwt!);

        const updateStatus = (req: RentRequest) =>
          req.id === requestId ? { ...req, status: "cancelled" as const } : req;

        setUserRentRequests((prev) => prev.map(updateStatus));
        setOwnerRentRequests((prev) => prev.map(updateStatus));
      } catch (err: any) {
        handleError(err, "Error canceling rent request.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Confirm rent request (owner)
  const confirmRequest = useCallback(
    async (requestId: number): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        await confirmRentRequestByOwner(requestId, jwt!);

        const updateStatus = (req: RentRequest) =>
          req.id === requestId ? { ...req, status: "confirmed" as const } : req;

        setOwnerRentRequests((prev) => prev.map(updateStatus));
        setUserRentRequests((prev) => prev.map(updateStatus));
      } catch (err: any) {
        handleError(err, "Error confirming rent request.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Reject rent request (owner)
  const rejectRequest = useCallback(
    async (requestId: number): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        await rejectRentRequestByOwner(requestId, jwt!);

        const updateStatus = (req: RentRequest) =>
          req.id === requestId ? { ...req, status: "rejected" as const } : req;

        setOwnerRentRequests((prev) => prev.map(updateStatus));
        setUserRentRequests((prev) => prev.map(updateStatus));
      } catch (err: any) {
        handleError(err, "Error rejecting rent request.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Cancel confirmed request (owner)
  const cancelConfirmedRequest = useCallback(
    async (requestId: number): Promise<void> => {
      if (!validateAuth()) return;

      setLoading(true);
      setError(null);

      try {
        await cancelConfirmedByOwner(requestId, jwt!);

        const updateStatus = (req: RentRequest) =>
          req.id === requestId
            ? { ...req, status: "cancelled_by_owner" as const }
            : req;

        setOwnerRentRequests((prev) => prev.map(updateStatus));
        setUserRentRequests((prev) => prev.map(updateStatus));
      } catch (err: any) {
        handleError(err, "Error canceling confirmed request.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Pay for rent request
  const payForRentRequest = useCallback(
    async (requestId: number, paymentData: PaymentData): Promise<any> => {
      if (!validateAuth()) return null;

      setLoading(true);
      setError(null);

      try {
        const result = await payForRequest(requestId, paymentData, jwt!);

        const updateStatus = (req: RentRequest) =>
          req.id === requestId ? { ...req, status: "paid" as const } : req;

        setUserRentRequests((prev) => prev.map(updateStatus));
        setOwnerRentRequests((prev) => prev.map(updateStatus));

        return result;
      } catch (err: any) {
        handleError(err, "Error processing payment.");
        throw err;
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
    setUserRentRequests([]);
    setOwnerRentRequests([]);
    setUserPagination(null);
    setOwnerPagination(null);
    setRequestDetails(null);
    setStats(null);
    setUnavailableDates([]); 
    setError(null);
  }, []);

  return {
    // State
    userRentRequests,
    ownerRentRequests,
    userPagination,
    ownerPagination,
    requestDetails,
    stats,
    unavailableDates, 
    loading,
    error,

    // Actions
    fetchUserRentRequests,
    fetchOwnerRentRequests,
    fetchRequestDetails,
    fetchRequestStats,
    fetchUnavailableDates, 
    createRequest,
    cancelRequest,
    confirmRequest,
    rejectRequest,
    cancelConfirmedRequest,
    payForRentRequest,
    clearError,
    resetState,

    // Legacy compatibility
    userTotal: userPagination?.total || 0,
    ownerTotal: ownerPagination?.total || 0,
    cancelByOwnerRequest: cancelConfirmedRequest,
  };
};
