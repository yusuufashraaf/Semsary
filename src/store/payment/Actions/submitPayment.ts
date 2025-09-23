import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/axios-global";
import { PaymentFormData } from "@validations/paymentSchema";
import { isAxiosError } from "axios";



const submitPayment =createAsyncThunk('payment/submitPayment',
    async(paymentData:PaymentFormData,thunkApi)=>{

    
        const {rejectWithValue,fulfillWithValue}= thunkApi;
        try {
            const response = await api.post('/payment/process',paymentData);
            
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
})
export default submitPayment