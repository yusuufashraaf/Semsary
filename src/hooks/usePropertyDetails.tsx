import { useState, useEffect, useCallback } from "react";
import { getProperty } from "@services/PropertyDetailsService";
import { Listing } from "src/types";

export const usePropertyDetails = (id: number | null) => {
  const [property, setProperty] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const data = await getProperty(id, signal);
        if (signal?.aborted) return;
        setProperty(data);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to fetch property:", err);
          setError("Failed to fetch property details.");
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    fetchProperty(controller.signal);
    return () => controller.abort();
  }, [fetchProperty, id]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
};
