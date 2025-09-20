import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { RootState } from "@store/index";
import { isAxiosError } from "axios";
import { ChangePasswordFormValues } from "src/types/users/users.types";


const ActChangePassword=createAsyncThunk('Auth/changePassword',
    async(formData:ChangePasswordFormValues,thunkApi)=>{

        const {rejectWithValue,fulfillWithValue,getState}= thunkApi;
        const state = getState() as RootState;
        
        const token = state.Authslice.jwt;
        
        try {
        const response = await api.post('user/change-password',{...formData},{headers: {
          Authorization: `Bearer ${token}`,
        },});
            return fulfillWithValue(response.data)

        } catch (error) {
             if (isAxiosError(error)) {
                const serverData = error.response?.data;

            if (serverData?.errors) {
                const flatErrors = Object.values(serverData.errors)
                    .flat()
                    .join(", ");
                return rejectWithValue(flatErrors); // always a string
                }
                return rejectWithValue(serverData?.message || error.message);
            } else {
                return rejectWithValue("An unexpected error");
            }
        }
});
export default ActChangePassword;