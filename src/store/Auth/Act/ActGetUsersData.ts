import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global"; // Your global axios instance
import { RootState } from "@store/index";
import axios from "axios";

import { TUser } from "src/types/users/users.types";

const ActGetUsersData = createAsyncThunk<
  TUser, 
  void,
  { state: RootState }
>(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState() as RootState;
    const token = state.Authslice.jwt;

    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    try {
      const response = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Fetch user profile error:", error.response.data);
        return rejectWithValue(error.response.data.message || "Failed to fetch user profile.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export default ActGetUsersData;