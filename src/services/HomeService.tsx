// services/categoryService.ts
import axios from "axios";
import { CategoryCardProps, Listing } from "src/types";

// ---- Backend Response Type ----
interface CategoryApiResponse {
  message: string;
  data: { type: string; image: string }[];
  success: boolean;
}

// ---- Backend Response Type ----
interface FeaturedListingApiResponse {
  message: string;
  data: Listing[];
  success: boolean;
}


// ---- Axios Instance ----
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// ---- Service Function ----
export const getCategories = async (
  signal?: AbortSignal
): Promise<CategoryCardProps[]> => {
  try {
    const response = await API.get<CategoryApiResponse>(
      "/properties/categories",
      { signal }
    );

    // Transform backend data into frontend-friendly format
    return response.data.data.map((item, index) => ({
      id: index + 1,
      type: item.type,
      image: item.image,
      link: `/property?type=${encodeURIComponent(item.type)}`, 
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Unable to fetch categories");
  }
};


// ---- Service Function ----
export const getFeaturedListings = async (
  signal?: AbortSignal
): Promise<Listing[]> => {
  try {
    const response = await API.get<FeaturedListingApiResponse>(
      "/properties/feature-listing",
      { signal }
    );

    return response.data.data; // already matches Listing[]
  } catch (error) {
    console.error("❌ Failed to fetch featured listings:", error);
    throw new Error("Unable to fetch featured listings");
  }
};
