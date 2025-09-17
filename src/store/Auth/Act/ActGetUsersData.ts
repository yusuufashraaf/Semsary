import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global"; // Your global axios instance
import { RootState } from "@store/index";
import axios from "axios";

import { TFullUser } from "src/types/users/users.types";

const ActGetUsersData = createAsyncThunk<
  TFullUser, 
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
      const response = await api.post("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return response.data.user;

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to fetch user profile.");
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export default ActGetUsersData;