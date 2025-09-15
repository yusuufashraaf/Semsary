import api from "./axios-global"; 

// Get Dashboard data
export const fetchOwnerDashboard = async () => {
  const response = await api.get("/owner/dashboard");
  return response.data.data;
};

// Add New Property
export const addProperty = async (propertyData: any) => {
  const response = await api.post("/properties", propertyData);
  return response.data;
};

// Get all properties (owner only)
export const fetchOwnerProperties = async () => {
  const response = await api.get("properties");
  return response.data.data;
};
