import axios from "axios";
import { Review } from "src/types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getReviews = async (
  propertyId: number,
  page: number = 1,
  signal?: AbortSignal
): Promise<{ data: Review[]; total: number }> => {
  const response = await API.get(
    `/properties/${propertyId}/reviews?page=${page}`,
    { signal }
  );

  return {
    data: response.data.data,
    total: response.data.meta.total ?? 0,
  };
};
