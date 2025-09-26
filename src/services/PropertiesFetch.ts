import { isAxiosError } from "axios";
import api from "./axios-global";



// ---------------- Utility ----------------
const handleError = (error: any): never => {
  if (isAxiosError(error)) {
    console.error("Axios Error:", error.response?.data || error.message);
  } else {
    console.error("Unexpected Error:", error);
  }
  throw error;
};

// ---------------- Types ----------------
export interface Property {
  id: number;
  title: string;
  description: string;
  property_details:{
    price:number;
    size: number;
    price_type: "FullPay" | "Monthly" | "Daily";

  };
  type: "Apartment" | "Villa" | "Duplex" | "Roof" | "Land";
  location: Record<string, any>;
  status: "Valid" | "Invalid" | "Pending" | "Rented" | "Sold" | "Rejected";
  created_at: string;
  updated_at: string;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  documents?: string[];
  images?: {
    id:number,
    url:string
  }[];
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
  filters?: { property_state?: string },
  signal?: AbortSignal
): Promise<PropertiesResponse | undefined> => {
  try {
    const response = await api.get<PropertiesResponse>(`cs-agent/properties`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: filters,   // 👈 send filter(s) to backend
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
  newState: "Valid" | "Rejected",
  jwt: string | null,
  signal?: AbortSignal
): Promise<ChangeStatusResponse | undefined> => {
  try {
    const response = await api.patch<ChangeStatusResponse>(
      `/cs-agent/properties/${propertyId}/state`,
      { status: newState },
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
