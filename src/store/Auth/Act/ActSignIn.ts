import { signInType } from '@validations/signInSchema';
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { isAxiosError } from "axios";

const ActSignIn =createAsyncThunk('Auth/SignIn',
    async(formData:signInType,thunkApi)=>{

        
        const {rejectWithValue,fulfillWithValue}= thunkApi;
        try {
            const response = await api.post('/login',formData);
            
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("SignIn error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActSignIn