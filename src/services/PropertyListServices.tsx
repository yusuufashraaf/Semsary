import axios from "axios";
import { Listing, FilterOptions } from "src/types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Laravel paginator response
export interface LaravelPaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

// Query params for properties
export interface PropertyQuery {
  search?: string;
  location?: string;
  type?: string;
  beds?: number | string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  page?: number;
  per_page?: number;
}

// Get properties with query filters
export const getProperties = (query: PropertyQuery = {}) =>
  API.get<LaravelPaginatedResponse<Listing>>("/propertiesList", {
    params: query,
  });

// Get filter options
export const getFilterOptions = async (
  signal?: AbortSignal
): Promise<FilterOptions & { priceMin: number; priceMax: number }> => {
  const response = await API.get("/propertiesList/filtersOptions", { signal });
  return response.data;
};
