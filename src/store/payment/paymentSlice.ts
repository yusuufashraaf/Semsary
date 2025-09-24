import { createSlice } from "@reduxjs/toolkit";
import { PaymentFormData } from "@validations/paymentSchema";
import submitPayment from "./Actions/submitPayment";
import { TLoading } from "@app-types/index";



interface PaymentState {
  loading: TLoading;
  error: string | null;
  success: boolean;
  paymentData: PaymentFormData | null;
}

const initialState: PaymentState = {
  loading: "idle",
  error: null,
  success: false,
  paymentData: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.success = false;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.success = true;
         if (action.payload?.url) {
          window.location.href = action.payload.url; // this is IFrame redirect to Paymob page
        }
        
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;