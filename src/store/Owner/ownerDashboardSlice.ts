import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchOwnerDashboard, fetchOwnerProperties, fetchPropertyById ,addProperty, deleteProperty, updateProperty, updatePropertyState} from "../../services/ownerDashboard";


interface BoughtProperty {
  id: number;
  property_id: number;
  amount: number | string;
  purchase_date: string;
  // property: Property;
}

interface RentedProperty {
  id: number;
  property_id: number;
  amount: number | string;
  payment_type: string;
  // property: Property;
}
interface DashboardState {
  loading: boolean;
  errors: Record<string, string[]>;
  overview: {
    total_properties: number;
    bookings_count: number;
    sales_income: number | string;
    rent_income: number | string;
    total_income:number | string;
    total_reviews: number;
    average_rating: number;
    bought_properties:BoughtProperty[];
    rented_properties: RentedProperty[];
  };
  properties: any[];
  selectedProperty:any|null,
}

const initialState: DashboardState = {
  loading: false,
  errors: {},
  overview: {
    total_properties: 0 ,
    bookings_count: 0,
    sales_income: 0,
    rent_income:0,
    total_income:0,
    bought_properties:[],
    rented_properties: [],
    total_reviews: 0,
    average_rating: 0,
  },
  properties: [],
  selectedProperty: null,
};


// Thunks
export const getDashboardData = createAsyncThunk(
  "ownerDashboard/fetchOverview",
  async () => {
    return await fetchOwnerDashboard();
  }
);

export const getProperties = createAsyncThunk(
  "ownerDashboard/fetchProperties",
  async () => {
    return await fetchOwnerProperties();
  }
);

export const getPropertyById = createAsyncThunk(
  "ownerDashboard/fetchPropertyById",
  async (propertyId: string) => {
    const property = await fetchPropertyById(propertyId);
    return property;
  }
);


export const createProperty = createAsyncThunk(
  "ownerDashboard/addProperty",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await addProperty(formData);
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        return rejectWithValue(err.response.data.errors); //validation errors
      }
      return rejectWithValue({ general: ["Something went wrong"] });
    }
  }
);

export const EdittProperty = createAsyncThunk(
  "ownerDashboard/updateProperty",
  async ({ id, data }: { id: string | number; data: FormData }, { rejectWithValue }) => {
    try {
      // Convert id to string to ensure consistency
      const stringId = id.toString();
      const response = await updateProperty(stringId, data);
      
      // Make sure we return the updated property object
      // If the API returns { data: property }, extract the property
      const updatedProperty = response?.data || response;
      
      console.log("API Response:", response);
      console.log("Updated property data:", updatedProperty);
      
      return updatedProperty;
    } catch (err: any) {
      console.error("Update property error:", err);
      if (err.response && err.response.status === 422) {
        return rejectWithValue(err.response.data.errors);
      }
      return rejectWithValue({ general: ["Something went wrong"] });
    }
  }
);

export const UpdatePropertyState = createAsyncThunk(
  "ownerDashboard/updatePropertyState",
  async ({ id, state }: { id: string; state: string }, { rejectWithValue }) => {
    try {
      const response = await updatePropertyState(id, state);
      return response;
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        return rejectWithValue(err.response.data.errors); 
      }
      return rejectWithValue({ general: ["Something went wrong"] });
    }
  }
);

export const removeProperty = createAsyncThunk(
  "ownerDashboard/deleteProperty",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await deleteProperty(propertyId);
      return propertyId; // Return the deleted property's ID
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        return rejectWithValue(err.response.data.errors); 
      }
      return rejectWithValue({ general: ["Something went wrong"] });
    }
  }
);


const ownerDashboardSlice = createSlice({
  name: "ownerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard Overview
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errors = action.payload as Record<string, string[]>;
        }
      })
      // Properties
      .addCase(getProperties.fulfilled, (state, action) => {
        state.properties = action.payload;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload);
      })
      .addCase(removeProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(property => property.id !== action.payload);
      })
      .addCase(getPropertyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errors = action.payload as Record<string, string[]>;
        }
      })
      // updateProperty
      .addCase(EdittProperty.pending, (state) => {
      state.loading = true;
      state.errors = {}; // Clear previous errors
    })
    .addCase(EdittProperty.fulfilled, (state, action) => {
      state.loading = false;
      const updatedProperty = action.payload;
      
      console.log("Payload received in reducer:", updatedProperty);
      
      // Find and update the property in the array
      const propertyIndex = state.properties.findIndex(
        (p) => p.id.toString() === updatedProperty.id.toString()
      );
      
      if (propertyIndex !== -1) {
        // Update the existing property
        state.properties[propertyIndex] = {
          ...state.properties[propertyIndex],
          ...updatedProperty
        };
        console.log("Property updated at index:", propertyIndex);
        console.log("New property state:", state.properties[propertyIndex].property_state);
      } else {
        console.error("Property not found in array for update");
      }
      
      // Update selectedProperty if it exists
      if (state.selectedProperty && state.selectedProperty.id.toString() === updatedProperty.id.toString()) {
        state.selectedProperty = { ...state.selectedProperty, ...updatedProperty };
      }
    })
    .addCase(EdittProperty.rejected, (state, action) => {
      state.loading = false;
      console.error("Edit property rejected:", action.payload);
      if (action.payload) {
        state.errors = action.payload as Record<string, string[]>;
      }
    })
          
      },
    });

export default ownerDashboardSlice.reducer;