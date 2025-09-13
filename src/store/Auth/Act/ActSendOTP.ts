import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { OtpType } from "@validations/otpSchema";
import { isAxiosError } from "axios";

const ActSendOTP =createAsyncThunk('Auth/sendOTP',
    async(data:OtpType,thunkApi)=>{
    
        
        const {rejectWithValue,fulfillWithValue,getState}= thunkApi;
        const state = getState() as RootState;
     
        const user_id = state.Authslice.user?.id;

        try {
            const response = await api.post('/verify-email',{ user_id,
        otp: data.emailOTP,});
            
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