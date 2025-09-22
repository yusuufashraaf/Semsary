import { useState, useEffect } from "react";
import { getBalances, Balances } from "@services/userBalanceService";

export function useBalances() {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBalances = async () => {
      try {
        setLoading(true);
        const data = await getBalances(controller.signal);
        setBalances(data);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError("Failed to load balances");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();

    return () => controller.abort(); // cleanup
  }, []);

  return { balances, loading, error };
}
