import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { isAxiosError } from "axios";

const ActCheckAuth = createAsyncThunk(
  "auth/ActCheckAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/refresh");

      if (!response.data.access_token) {
        return rejectWithValue("No valid session");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          return rejectWithValue("Session expired");
        }
        return rejectWithValue(error.response?.data?.message || error.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);
export default ActCheckAuth