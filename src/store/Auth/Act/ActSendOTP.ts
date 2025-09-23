import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { OtpType } from "@validations/otpSchema";
import { isAxiosError } from "axios";

interface dataTosend{
    otp:OtpType,
    email:string
}

const ActSendOTP =createAsyncThunk('Auth/sendOTP',
    async(data:dataTosend,thunkApi)=>{
        
        
        const {rejectWithValue,fulfillWithValue}= thunkApi;

        try {
      const response = await api.post("/verify-email", {
        email: data.email,
        otp: typeof data.otp === "object" ? data.otp.emailOTP : data.otp, 
      });
            
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("verify-email error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActSendOTP