import axios from "axios";
import { Listing } from "src/types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Get single property by id
export const getProperty = async (
  id: number,
  signal?: AbortSignal
): Promise<Listing> => {
  const response = await API.get<{ data: Listing }>(`/propertiesList/${id}`, {
    signal,
  });
  return response.data.data;
};
