import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { isAxiosError } from "axios";

interface SendOtpPayload {
  phone_number: string;
}

const ActSendWhatsOTP = createAsyncThunk(
  "Auth/SendWhatsOTP",
  async (payload: SendOtpPayload, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;
    const state = getState() as RootState;
    const user_id = state.Authslice.user?.id;

    if (!user_id) return rejectWithValue("User not found");

    try {
      const response = await api.post("/send-phone-otp", {
        user_id,
        phone_number: payload.phone_number,
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      } else {
        return rejectWithValue("An unexpected error");
      }
    }
  }
);

export default ActSendWhatsOTP;