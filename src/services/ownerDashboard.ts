import api from "./axios-global"; 

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