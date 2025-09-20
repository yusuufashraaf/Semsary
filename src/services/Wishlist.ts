// src/services/Wishlist.ts
import api from "@services/axios-global"; // <-- use your axios instance with interceptors
import { Listing } from "src/types";

// Get all wishlist properties for logged-in user
export const getWishlist = async (
  page: number = 1,
  signal?: AbortSignal
): Promise<{ data: Listing[] }> => {
  const response = await api.get(`/wishlist?page=${page}`, { signal });
  return {
    data: response.data.data ?? response.data,
  };
};

// Add a property to wishlist
export const addToWishlist = async (propertyId: number) => {
  const response = await api.post(`/wishlist`, { property_id: propertyId });
  return response.data;
};

// Remove a property from wishlist
export const removeFromWishlist = async (propertyId: number) => {
  const response = await api.delete(`/wishlist/${propertyId}`);
  return response.data;
};
