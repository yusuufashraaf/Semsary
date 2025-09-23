import { useState, useEffect } from "react";
import { fetchWallet } from "../services/walletService";

export function useWallet() {
  const [wallet, setWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchWallet()
      .then((data) => {
        setWallet(data);
        setError(null);
      })
      .catch((err) => {
        setError("Login Please...");
        setWallet(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { wallet, loading, error };
}
