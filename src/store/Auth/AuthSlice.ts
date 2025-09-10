import { createSlice } from "@reduxjs/toolkit";
import { TLoading } from "src/types";
import ActSignUp from "./Act/ActSignUp";

interface IAuthState{
    user:{
        id:number,
        email:string,
        firstName:string,
        lastName:string
    } | null,
    loading:TLoading
    error:string|null
    jwt:string|null
}

const initialState:IAuthState={
    user:null,
    loading:"idle",
    error:null,
    jwt:null
};
const AuthSlice =createSlice({
    name:"Auth",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(ActSignUp.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActSignUp.fulfilled,(state)=>{
            state.loading = "succeeded";

        });
        builder.addCase(ActSignUp.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
            
            
        });
    }
})

export default AuthSlice.reducer