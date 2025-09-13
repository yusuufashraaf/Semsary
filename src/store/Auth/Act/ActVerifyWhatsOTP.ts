import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { PhoneOtpType } from "@validations/phoneOtpSchema";
import { isAxiosError } from "axios";

const ActVerifyWhatsOTP =createAsyncThunk('Auth/SendWhatsOTP',
    async(data:PhoneOtpType,thunkApi)=>{
    
        
        const {rejectWithValue,fulfillWithValue,getState}= thunkApi;
        const state = getState() as RootState;
        const user_id = state.Authslice.user?.id;

        try {
            const response = await api.post('/verify-phone-otp',{ user_id,otp:data.phoneOTP});
            
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("VerifyWhatsOTP error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActVerifyWhatsOTP