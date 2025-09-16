import { useState, useEffect, useCallback } from "react";
import {
  getProperties,
  PropertyQuery,
  LaravelPaginatedResponse,
} from "@services/PropertyListServices";
import { Listing } from "src/types";

export const usePropertiesList = (query: PropertyQuery) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(query.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [perPage, setPerPage] = useState(query.per_page || 12);

  const fetchProperties = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getProperties({ ...query, page: currentPage });
        if (signal?.aborted) return;

        const data: LaravelPaginatedResponse<Listing> = res.data;
        setListings(data.data);
        setTotalPages(data.last_page);
        setTotalResults(data.total);
        setPerPage(data.per_page);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Failed to fetch properties:", err);
          setError("Failed to fetch properties.");
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [query, currentPage]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProperties(controller.signal);
    return () => controller.abort();
  }, [fetchProperties]);

  // 👇 calculate range for "Showing x–y of z"
  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(currentPage * perPage, totalResults);

  return {
    listings,
    loading,
    error,
    currentPage,
    totalPages,
    totalResults,
    perPage,
    startIndex,
    endIndex,
    setCurrentPage,
    refetch: fetchProperties,
  };
};
