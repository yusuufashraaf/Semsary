import { useEffect, useState } from "react";
import { getFeaturedListings } from "@services/HomeService";
import { Listing } from "src/types";
import { useAppSelector } from "@store/hook";
export function useFeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAppSelector(state => state.Authslice);
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await getFeaturedListings(controller.signal);
        const filtereddata = data.filter((property: Listing) => property.owner_id !== user?.id)
        setListings(filtereddata);
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
