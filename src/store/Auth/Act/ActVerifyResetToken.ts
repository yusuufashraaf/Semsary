import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import axios from "axios";

type VerifyTokenData = {
  email: string;
  token: string;
};

const ActVerifyResetToken = createAsyncThunk(
  "Auth/verifyResetToken",
  async (data: VerifyTokenData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await api.post("/verify-reset-token", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Invalid token.");
    }
  }
);

export default ActVerifyResetToken;
