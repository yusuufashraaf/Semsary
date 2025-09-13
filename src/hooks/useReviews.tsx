import { useState, useCallback } from "react";
import { Review } from "src/types";

/**
 * Custom hook for managing property reviews.
 *
 * - Handles review state (list + total count + loading + error)
 * - Provides a mock async fetch function with pagination
 * - Can be swapped with a real API call
 */
export const useReviews = () => {
  // State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mocked review data
  // (replace with API response in real app)
  const allReviews: Review[] = [
    {
      id: 1,
      reviewer: "Sarah Carter",
      rating: 5,
      review: "Absolutely wonderful stay!",
      date: "2025-07-12",
    },
    {
      id: 2,
      reviewer: "Lisa Brown",
      rating: 4,
      review: "Nice place but the AC was a little weak.",
      date: "2025-08-01",
    },
    {
      id: 3,
      reviewer: "Jim Parker",
      rating: 5,
      review: "Perfect for our family.",
      date: "2025-08-20",
    },
  ];

  // Fetch reviews
  const fetchReviews = useCallback(async (page: number) => {
    setLoading(true);
    setError(null); // reset error before fetching

    const reviewsPerPage = 3;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Example: throw error randomly (for testing)
      if (Math.random() < 0.1) throw new Error("Failed to fetch reviews");

      const start = (page - 1) * reviewsPerPage;
      const end = start + reviewsPerPage;

      setReviews(allReviews.slice(start, end));
      setTotal(allReviews.length);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Public API
  return { reviews, total, loading, error, fetchReviews };
};
