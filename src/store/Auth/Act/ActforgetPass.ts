import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";

import { ForgotPasswordType } from "@validations/forgotPasswordSchema";
import { isAxiosError } from "axios";

const ActforgetPass =createAsyncThunk('Auth/forgotPass',
    async(data:ForgotPasswordType,thunkApi)=>{
    
        const {rejectWithValue,fulfillWithValue}= thunkApi;

     
        try {
            const response = await api.post('/forgot-password',{email: data.email});
            
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("forgot password error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActforgetPass