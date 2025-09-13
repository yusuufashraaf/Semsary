
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";

import { ResetPasswordType } from "@validations/resetPasswordSchema";
import { isAxiosError } from "axios";

type ResetPasswordPayload = ResetPasswordType & {
  email: string;
  token: string;
};

const ActResetPass =createAsyncThunk('Auth/resetpass',
    async(data:ResetPasswordPayload,thunkApi)=>{
    
        const {rejectWithValue,fulfillWithValue}= thunkApi;
        const email = data.email;
        const token = data.token;
     
        try {
            const response = await api.post('/forgot-password',{password: data.password,
                password_confirmation:data.password_confirmation,token,email});
            
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
export default ActResetPass