import { useEffect, useState } from "react";
import { CategoryCardProps } from "src/types";
import { getCategories } from "@services/HomeService";
import axios from "axios";
export default function useCategories() {
  const [categories, setCategories] = useState<CategoryCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await getCategories(controller.signal);
        setCategories(data);
      } catch (err) {
        if (axios.isCancel?.(err)) return; 
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}
