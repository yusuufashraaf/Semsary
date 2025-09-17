import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOwnerDashboard, fetchOwnerProperties, fetchPropertyById ,addProperty, deleteProperty, updateProperty } from "../../services/ownerDashboard";

interface DashboardState {
  loading: boolean;
  errors: Record<string, string[]>;
  overview: {
    total_properties: number;
    total_bookings: number;
    total_income: number;
    total_reviews: number;
    average_rating: number;
  };
  properties: any[];
  selectedProperty:any|null,
}

const initialState: DashboardState = {
  loading: false,
  errors: {},
  overview: {
    total_properties: 0,
    total_bookings: 0,
    total_income: 0,
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
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await updateProperty(id, data);
      return response;
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        return rejectWithValue(err.response.data.errors); //validation errors
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
      })
      .addCase(EdittProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
        state.selectedProperty = action.payload;
      })
      .addCase(EdittProperty.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.errors = action.payload as Record<string, string[]>;
        }
      });
      
  },
});

export default ownerDashboardSlice.reducer;
