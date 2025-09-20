import api from "./axios-global"; 
import { ReviewAnalysisResponse } from "../types/ReviewAnalysis";

// Get Dashboard data
export const fetchOwnerDashboard = async () => {
  const response = await api.get("/owner/dashboard");
  return response.data.data;
};

// Get all properties (owner only)
export const fetchOwnerProperties = async () => {
  const response = await api.get("properties");
  return response.data.data;
};

// Get Property by ID
export const fetchPropertyById = async (propertyId: string) => {
  const response = await api.get(`/properties/${propertyId}`);
  return response.data.data;
};

// Add New Property
export const addProperty = async (formData: FormData) => {
  const response = await api.post("/properties", formData);
  return response.data;
};

//Edit Property
export const updateProperty = async (propertyId: string, formData: FormData) => {
  const response = await api.post(`/properties/${propertyId}?_method=PUT`, formData);
  return response.data;
};
// Delete Property
export const deleteProperty = async (propertyId: number) =>{
  const response = await api.delete(`/properties/${propertyId}`);
  return response.data;
}
// Generate Property Description using AI
export const generateDescription = async (property: {title:string, bedrooms:number,bathrooms:number, size:number, location:string}) => {
  const res = await api.post('/properties/generate-description', property);
  
  if (res.data.success && res.data.description) {
    return res.data.description;
  }
  
  throw new Error(res.data.message || 'Failed to generate description');
};
export async function getPropertyReviewAnalysis(propertyId: number): Promise<ReviewAnalysisResponse>{
  const response = await api.get(`/properties/${propertyId}/reviews/analysis`);
  return response.data;
}