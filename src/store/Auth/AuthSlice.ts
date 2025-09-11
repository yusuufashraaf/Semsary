import { createSlice } from "@reduxjs/toolkit";
import { TLoading } from "src/types";
import ActSignUp from "./Act/ActSignUp";
import ActSignIn from "./Act/ActSignIn";
import ActLogout from "./Act/ActLogout";
import ActCheckAuth from "./Act/ActCheckAuth";
import ActSendOTP from "./Act/ActSendOTP";


interface IAuthState{
    user:{
        id:number,
        email:string,
        first_name:string,
        last_name:string,
        phone_number:string,
        role: string,
        status:string,
        created_at:string
    } | null,
    loading:TLoading
    error:string|null
    jwt:string|null
    isInitialized:boolean
}

const initialState:IAuthState={
    user:null,
    loading:"idle",
    error:null,
    jwt:null,
    isInitialized:false
};
const AuthSlice =createSlice({
    name:"Auth",
    initialState,
    reducers:{
         resetUI:(state)=>{
            state.loading="idle";
            state.error=null;
        },
        Logout:(state)=>{
            state.jwt=null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(ActSignUp.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActSignUp.fulfilled,(state,action)=>{
            state.loading = "succeeded";
   
            state.user = action.payload.user;
            
        });
        builder.addCase(ActSignUp.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActSignIn.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActSignIn.fulfilled,(state,action)=>{
            state.loading = "succeeded";
            console.log(action.payload.access_token);
            
            state.jwt = action.payload.access_token;
        });
        builder.addCase(ActSignIn.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActLogout.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActLogout.fulfilled,(state)=>{
            state.loading = "succeeded";
            Logout();
            state.error = null;
        });
        builder.addCase(ActLogout.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
           builder

            .addCase(ActCheckAuth.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(ActCheckAuth.fulfilled, (state, action) => {
                state.loading = 'succeeded';              
                state.jwt = action.payload.access_token;
                state.isInitialized = true;
                
            })
            .addCase(ActCheckAuth.rejected, (state) => {
                state.loading = 'failed';
                state.isInitialized = true; 

            });

        builder.addCase(ActSendOTP.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActSendOTP.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.error = null;
        });
        builder.addCase(ActSendOTP.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });


    }
})

export default AuthSlice.reducer;
export const {resetUI,Logout} = AuthSlice.actions