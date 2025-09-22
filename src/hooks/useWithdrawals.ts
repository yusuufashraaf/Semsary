import { useEffect, useState } from "react";
import {
  getWithdrawalInfo,
  getWithdrawalHistory,
  requestWithdrawal,
  WithdrawalRequest,
  WithdrawalHistoryResponse,
  WithdrawalRequestData,
} from "@services/withdrawalService";

// Get withdrawal history (paginated)
export function useWithdrawalHistory(page = 1) {
  const [history, setHistory] = useState<WithdrawalHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getWithdrawalHistory(page, controller.signal)
      .then(setHistory)
      .catch((err) => setError(err.message || "Failed to fetch withdrawal history"))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

  return { history, loading, error };
}

// Get withdrawal info (balance, limits, etc.)
export function useWithdrawalInfo() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getWithdrawalInfo(controller.signal)
      .then(setInfo)
      .catch((err) => setError(err.message || "Failed to fetch withdrawal info"))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { info, loading, error };
}

// Request a withdrawal
export function useWithdrawalActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async (data: WithdrawalRequestData): Promise<WithdrawalRequest | null> => {
    setLoading(true);
    setError(null);
    try {
      return await requestWithdrawal(data);
    } catch (err: any) {
      setError(err.message || "Withdrawal request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { makeRequest, loading, error };
}
