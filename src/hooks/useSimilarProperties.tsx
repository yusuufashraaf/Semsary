import { useEffect, useState } from "react";
import { SimilarProperty } from "src/types";

/**
 * Hook for fetching similar properties.
 *
 * - Simulates async data fetch with a delay
 * - Manages loading & error states
 * - Returns mock data (replace with API in production)
 */
export const useSimilarProperties = () => {
  // State
  const [data, setData] = useState<SimilarProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect: fetch similar properties
  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        // Simulated API data
        const mockSimilar: SimilarProperty[] = [
          {
            id: "1",
            image:
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
            title: "456 Pine Avenue",
            price: "$850,000",
            rating: 4.8,
            location: "Zamalek",
          },
          {
            id: "2",
            image:
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80",
            title: "789 Maple Street",
            price: "$920,000",
            rating: 4.6,
            location: "Garden City",
          },
          {
            id: "3", // fixed duplicate ID
            image:
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80",
            title: "321 Oak Road",
            price: "$780,000",
            rating: 4.7,
            location: "Maadi",
          },
        ];

        // Simulate random error (for testing)
        if (Math.random() < 0.1) {
          throw new Error("Failed to fetch similar properties");
        }

        setData(mockSimilar);
      } catch (err) {
        console.error("Error fetching similar properties:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Public API
  return { data, loading, error };
};
