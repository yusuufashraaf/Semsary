import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { isAxiosError } from "axios";

const ActCheckAuth = createAsyncThunk('auth/ActCheckAuth',
    async(_,thunkApi)=>{
        const {rejectWithValue,fulfillWithValue}= thunkApi;

        try {
            const response = await api.post('/refresh'); 
            return fulfillWithValue(response.data)

        } catch (error) {
            console.error("check error:", error);
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }

})

export default ActCheckAuth;