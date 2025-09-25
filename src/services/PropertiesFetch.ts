// src/services/PropertiesFetch.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ---------------- Utility ----------------
const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
  throw error;
};

// ---------------- Types ----------------
export interface Property {
  id: number;
  owner_id: number | null;
  title: string;
  description: string;
  type: "Apartment" | "Villa" | "Duplex" | "Roof" | "Land";
  price: number;
  price_type: "FullPay" | "Monthly" | "Daily";
  location: Record<string, any>;
  size: number;
  property_state: "Valid" | "Invalid" | "Pending" | "Rented" | "Sold";
  created_at: string;
  updated_at: string;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  documents?: string[];
  image?: string[];
}

export interface PropertiesResponse {
  success: boolean;
  message?: string;
  data: Property[];
}

export interface ChangeStatusResponse {
  success: boolean;
  message: string;
  data: Property;
}

// ---------------- API Calls ----------------
export const getProperties = async (
  jwt: string | null,
  signal?: AbortSignal
): Promise<PropertiesResponse | undefined> => {
  try {
    const response = await API.get<PropertiesResponse>(`/properties`, {
      headers: { Authorization: `Bearer ${jwt}` },
      signal,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return undefined;
  }
};


export const changePropertyStatus = async (
  propertyId: number,
  newStatus: Property["property_state"],
  jwt: string | null,
  signal?: AbortSignal
): Promise<ChangeStatusResponse | undefined> => {
  try {
    const response = await API.post<ChangeStatusResponse>(
      `/properties/${propertyId}/change-status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${jwt}` },
        signal,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return undefined;
  }
};
