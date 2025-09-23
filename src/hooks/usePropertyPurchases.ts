import { useState, useCallback, useEffect } from "react";
import {
  PropertyPurchase,
  PropertyEscrow,
  Wallet,
} from "src/types";
import {
  payForProperty,
  cancelPurchase,
  getUserPurchases,
  getUserPurchaseForProperty,
  PurchaseResponse,
  CancelResponse,
  UserPurchasesResponse,
  PropertyPurchaseResponse,
} from "@services/propertyPurchase";
import { useAppSelector } from "@store/hook";

interface UsePropertyPurchasesReturn {
  // Data
  purchases: PropertyPurchase[];
  activePurchase: PropertyPurchase | null;
  hasActivePurchase: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  pay: (
    propertyId: number,
    payload: { expected_total: number; idempotency_key?: string; payment_method_token?: string }
  ) => Promise<PurchaseResponse | null>;
  cancel: (purchaseId: number) => Promise<CancelResponse | null>;
  fetchUserPurchases: () => Promise<void>;
  fetchPurchaseForProperty: (propertyId: number) => Promise<PropertyPurchase | null>;
  clearError: () => void;
  resetState: () => void;
}

export const usePropertyPurchases = (): UsePropertyPurchasesReturn => {
  const [purchases, setPurchases] = useState<PropertyPurchase[]>([]);
  const [activePurchase, setActivePurchase] = useState<PropertyPurchase | null>(null);
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

  // Fetch all user purchases
  const fetchUserPurchases = useCallback(async (): Promise<void> => {
    if (!validateAuth()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result: UserPurchasesResponse = await getUserPurchases(jwt!);
      
      if (result.success && result.data.purchases) {
        setPurchases(result.data.purchases);
        console.log("Fetched user purchases:", result.data.purchases);
      } else {
        setPurchases([]);
        console.log("No purchases found or API returned unsuccessful response");
      }
    } catch (err) {
      handleError(err, "Error fetching user purchases.");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, [jwt, validateAuth, handleError]);

  // Fetch purchase for specific property
  const fetchPurchaseForProperty = useCallback(async (propertyId: number): Promise<PropertyPurchase | null> => {
    if (!validateAuth()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result: PropertyPurchaseResponse = await getUserPurchaseForProperty(propertyId, jwt!);
      
      if (result.success && result.data.purchase) {
        const purchase = result.data.purchase;
        setActivePurchase(purchase);
        
        // Also update the purchases array if this purchase isn't already there
        setPurchases(prev => {
          const existingIndex = prev.findIndex(p => p.id === purchase.id);
          if (existingIndex >= 0) {
            // Update existing purchase
            const updated = [...prev];
            updated[existingIndex] = purchase;
            return updated;
          } else {
            // Add new purchase
            return [purchase, ...prev];
          }
        });
        
        console.log("Fetched purchase for property:", purchase);
        return purchase;
      } else {
        setActivePurchase(null);
        console.log("No active purchase found for property:", propertyId);
        return null;
      }
    } catch (err: any) {
      // 404 is expected when no purchase exists, don't treat as error
      if (err?.response?.status === 404) {
        setActivePurchase(null);
        return null;
      }
      
      handleError(err, "Error fetching purchase for property.");
      setActivePurchase(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [jwt, validateAuth, handleError]);

  // Pay for property
  const pay = useCallback(
    async (
      propertyId: number,
      payload: { expected_total: number; idempotency_key?: string; payment_method_token?: string }
    ): Promise<PurchaseResponse | null> => {
      if (!validateAuth()) return null;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await payForProperty(propertyId, payload, jwt!);
        
        if (result?.success && result?.data?.purchase) {
          const newPurchase = result.data.purchase;
          
          // Update purchases array
          setPurchases((prev) => [newPurchase, ...(prev || [])]);
          
          // Set as active purchase if it's for the current property
          setActivePurchase(newPurchase);
          
          console.log("Payment successful:", newPurchase);
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

  // Cancel purchase
  const cancel = useCallback(
    async (purchaseId: number): Promise<CancelResponse | null> => {
      if (!validateAuth()) return null;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await cancelPurchase(purchaseId, jwt!);
        
        if (result?.success) {
          // Update purchases array
          setPurchases((prev) =>
            prev.map((p) =>
              p.id === purchaseId ? { ...p, status: "cancelled" } : p
            )
          );
          
          // Update active purchase if it matches
          setActivePurchase(prev => 
            prev?.id === purchaseId ? { ...prev, status: "cancelled" } : prev
          );
          
          console.log("Purchase cancelled successfully");
        }
        
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

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Reset state
  const resetState = useCallback(() => {
    setPurchases([]);
    setActivePurchase(null);
    setError(null);
  }, []);

  // Computed value for hasActivePurchase
  const hasActivePurchase = !!activePurchase && !['cancelled', 'refunded'].includes(activePurchase.status);

  return {
    // Data
    purchases,
    activePurchase,
    hasActivePurchase,
    loading,
    error,
    
    // Actions
    pay,
    cancel,
    fetchUserPurchases,
    fetchPurchaseForProperty,
    clearError,
    resetState,
  };
};