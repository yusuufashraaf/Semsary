import { useState, useCallback } from "react";
import { Review } from "src/types";
import { getReviews } from "@services/PropertyReviewService";

export const useReviews = (propertyId: number | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(
    async (page: number = 1) => {
      if (!propertyId) return;

      setLoading(true);
      setError(null);

      try {
        // backend call for reviews
        const response = await getReviews(propertyId, page);

        // expecting { data, total } from backend
        setReviews(response.data);
        setTotal(response.total);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    },
    [propertyId]
  );

  return {
    reviews,
    total,
    loading,
    error,
    fetchReviews,
  };
};
