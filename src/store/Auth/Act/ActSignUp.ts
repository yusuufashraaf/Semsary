import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { signUpType } from "@validations/signUpSchema";
import { isAxiosError } from "axios";

const ActSignUp =createAsyncThunk('Auth/SignUp',
    async(formData:signUpType,thunkApi)=>{

        
        const {rejectWithValue,fulfillWithValue}= thunkApi;
        try {
            const response = await api.post('/register',formData);
            console.log(response);
            
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("SignUp error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
})
export default ActSignUp