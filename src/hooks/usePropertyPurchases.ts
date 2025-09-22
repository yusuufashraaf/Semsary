import { useState, useCallback } from "react";
import {
  PropertyPurchase,
  PropertyEscrow,
  Wallet,
} from "src/types";
import {
  payForProperty,
  cancelPurchase,
  getAllTransactions,
  PurchaseResponse,
  CancelResponse,
  TransactionsResponse,
} from "@services/propertyPurchase";
import { useAppSelector } from "@store/hook";

interface UsePropertyPurchasesReturn {
  purchases: PropertyPurchase[];
  escrows: PropertyEscrow[];
  wallet: Wallet | null;
  rents: any[];
  loading: boolean;
  error: string | null;

  pay: (
    propertyId: number,
    payload: { expected_total: number; idempotency_key?: string; payment_method_token?: string }
  ) => Promise<PurchaseResponse | null>;
  cancel: (purchaseId: number) => Promise<CancelResponse | null>;
  fetchTransactions: () => Promise<void>;
  clearError: () => void;
  resetState: () => void;
}

export const usePropertyPurchases = (): UsePropertyPurchasesReturn => {
  const [purchases, setPurchases] = useState<PropertyPurchase[]>([]);
  const [escrows, setEscrows] = useState<PropertyEscrow[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [rents, setRents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { jwt } = useAppSelector((state) => state.Authslice);

  const validateAuth = useCallback((): boolean => {
    if (!jwt) {
      setError("Authorization token missing. Please log in again.");
      return false;
    }
    return true;
  }, [jwt]);

  const handleError = useCallback((err: any, defaultMsg: string) => {
    console.error(defaultMsg, err);
    const msg = err?.response?.data?.message || err?.message || defaultMsg;
    setError(msg);
  }, []);

  // Pay
  const pay = useCallback(
    async (
      propertyId: number,
      payload: { expected_total: number; idempotency_key?: string; payment_method_token?: string }
    ): Promise<PurchaseResponse | null> => {
      if (!validateAuth()) return null;
      setLoading(true);
      try {
        const result = await payForProperty(propertyId, payload, jwt!);
        if (result?.data?.purchase) {
          setPurchases((prev) => [result.data.purchase, ...prev]);
          setEscrows((prev) => [result.data.escrow, ...prev]);
        }
        return result;
      } catch (err) {
        handleError(err, "Error processing property payment.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Cancel
  const cancel = useCallback(
    async (purchaseId: number): Promise<CancelResponse | null> => {
      if (!validateAuth()) return null;
      setLoading(true);
      try {
        const result = await cancelPurchase(purchaseId, jwt!);
        setPurchases((prev) =>
          prev.map((p) =>
            p.id === purchaseId ? { ...p, status: "cancelled" } : p
          )
        );
        return result;
      } catch (err) {
        handleError(err, "Error cancelling purchase.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jwt, validateAuth, handleError]
  );

  // Fetch all transactions
  const fetchTransactions = useCallback(async (): Promise<void> => {
    if (!validateAuth()) return;
    setLoading(true);
    try {
      const result: TransactionsResponse = await getAllTransactions(jwt!);
      setWallet(result.data.wallet);
      setPurchases(result.data.purchases);
      setRents(result.data.rents);
      if (result.data.escrows) {
        setEscrows(result.data.escrows);
      }
    } catch (err) {
      handleError(err, "Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  }, [jwt, validateAuth, handleError]);

  const clearError = useCallback(() => setError(null), []);
  const resetState = useCallback(() => {
    setPurchases([]);
    setEscrows([]);
    setWallet(null);
    setRents([]);
    setError(null);
  }, []);

  return {
    purchases,
    escrows,
    wallet,
    rents,
    loading,
    error,
    pay,
    cancel,
    fetchTransactions,
    clearError,
    resetState,
  };
};
