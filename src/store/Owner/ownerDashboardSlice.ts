import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOwnerDashboard, fetchOwnerProperties, addProperty } from "../../services/ownerDashboard";
import axios from "axios";

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

export const createProperty = createAsyncThunk(
  "ownerDashboard/addProperty",
  async (propertyData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/properties",
        propertyData
      );
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        return rejectWithValue(err.response.data.errors); // ⬅️ validation errors
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
      });
  },
});

export default ownerDashboardSlice.reducer;
