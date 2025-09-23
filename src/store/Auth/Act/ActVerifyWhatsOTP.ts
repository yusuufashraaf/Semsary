import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { isAxiosError } from "axios";

interface VerifyOtpPayload {
  phone_number: string;
  phoneOTP: string;
}

const ActVerifyWhatsOTP = createAsyncThunk(
  "Auth/VerifyWhatsOTP",
  async (payload: VerifyOtpPayload, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;
    const state = getState() as RootState;
    const user_id = state.Authslice.user?.id;

    if (!user_id) return rejectWithValue("User not found");

    try {
      const response = await api.post("/verify-phone-otp", {
        user_id,
        phone_number: payload.phone_number,
        otp: payload.phoneOTP,
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

export default ActVerifyWhatsOTP;