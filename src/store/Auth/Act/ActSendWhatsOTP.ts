import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { isAxiosError } from "axios";

const ActSendWhatsOTP =createAsyncThunk('Auth/SendWhatsOTP',
    async(_,thunkApi)=>{
    
        
        const {rejectWithValue,fulfillWithValue,getState}= thunkApi;
        const state = getState() as RootState;
        const user_id = state.Authslice.user?.id;

        try {
            const response = await api.post('/send-phone-otp',{ user_id});
            
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("SendWhatsOTP error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActSendWhatsOTP