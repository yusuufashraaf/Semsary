import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { isAxiosError } from "axios";

const ActReSendOTP =createAsyncThunk('Auth/reSendOTP',
    async(_,thunkApi)=>{
    
        
        const {rejectWithValue,fulfillWithValue,getState}= thunkApi;
        const state = getState() as RootState;
        
        const user_id = state.Authslice.user?.id;

        try {
            const response = await api.post('/resend-email-otp',{user_id});
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