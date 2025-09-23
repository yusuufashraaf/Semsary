import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { isAxiosError } from "axios";

const ActReSendOTP =createAsyncThunk('Auth/reSendOTP',
    async(email:string,thunkApi)=>{
    
        
        const {rejectWithValue,fulfillWithValue}= thunkApi;


        try {
            const response = await api.post('/resend-email-otp',{email});
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("resend-email error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActReSendOTP