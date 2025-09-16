import { useState, useEffect, useCallback } from "react";
import { FilterOptions } from "src/types";
import { getFilterOptions } from "@services/PropertyListServices";

interface UseFilterOptionsResult {
  data: FilterOptions | null;
  loading: boolean;
  error: string | null;
  refetch: () => AbortController;
}

export const useFilterOptions = (): UseFilterOptionsResult => {
  const [data, setData] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getFilterOptions(signal);

      const cleanedData: FilterOptions = {
        ...result,
        locations: [...new Set(result.locations)],
        propertyTypes: [...new Set(result.propertyTypes)],
        bedroomsOptions: [...new Set(result.bedroomsOptions)],
        statuses: [...new Set(result.statuses)],
        amenitiesOptions: [...new Set(result.amenitiesOptions)],
        minPrice: Number(result.priceMin) || 0,
        maxPrice: Number(result.priceMax) || 0,
      };

      // only update state if data actually changed
      setData((prev) =>
        JSON.stringify(prev) === JSON.stringify(cleanedData)
          ? prev
          : cleanedData
      );
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        console.error("Failed to fetch filter options:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch filter options"
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => controller.abort();
  }, [fetchData]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return controller;
  }, [fetchData]);

  return { data, loading, error, refetch };
};
