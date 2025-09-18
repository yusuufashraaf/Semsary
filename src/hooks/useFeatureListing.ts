import { useEffect, useState } from "react";
import { getFeaturedListings } from "@services/HomeService";
import { Listing } from "src/types";

export function useFeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await getFeaturedListings(controller.signal);
        setListings(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { listings, loading, error };
}
