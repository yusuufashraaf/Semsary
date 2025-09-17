import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signUpType } from "@validations/signUpSchema";


interface IFormState{
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    password_confirmation: string;
}

const initialState:IFormState={
    first_name:"",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
};
const FormSlice =createSlice({
    name:"FormSlice",
    initialState,
    reducers:{
        updateFormData: (state, action: PayloadAction<Partial<signUpType| { emailOTP: string }>>) => {

            return {
                ...state,
                ...action.payload,
            };
        }
        ,
         resetPasswordUI:(state)=>{
            state.password="";
            state.password_confirmation="";
        },
        resetForm: () => initialState,
    },

})

export default FormSlice.reducer;
export const {resetPasswordUI,updateFormData,resetForm} = FormSlice.actions