import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";


export const actFetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const state = getState() as RootState;
    // Get user from the state
    const {user} = state.Authslice
    if (!user?.id) return rejectWithValue("User not logged in");

    try {
      const response = await api.get(`/user/${user.id}/notifications`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch notifications");
    }
  }
);