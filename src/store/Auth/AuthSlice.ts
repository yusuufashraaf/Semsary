// src/store/Auth/AuthSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { TLoading } from "src/types";
import ActSignUp from "./Act/ActSignUp";
import ActSignIn from "./Act/ActSignIn";
import ActLogout from "./Act/ActLogout";
import ActCheckAuth from "./Act/ActCheckAuth";
import ActSendOTP from "./Act/ActSendOTP";
import ActReSendOTP from "./Act/ActReSendOTP";
import ActUploadId from "./Act/ActUploadId";
import ActVerifyWhatsOTP from "./Act/ActVerifyWhatsOTP";
import ActforgetPass from "./Act/ActforgetPass";
import ActResetPass from "./Act/ActResetPass";
import { TFullUser } from "src/types/users/users.types";
import ActGetUsersData from "./Act/ActGetUsersData";
import { initEcho, disconnectEcho } from "@services/echoManager";

interface IAuthState {
  user: TFullUser | null;
  loading: TLoading;
  error: string | null;
  jwt: string | null;
  isInitialized: boolean;
import { toast } from "react-toastify";
import ActChangePassword from "./Act/ActChangePassword";
import ActChangeEmail from "./Act/ActChangeEmail";
import ActChangePhone from "./Act/ActChangePhone";


interface IAuthState{
    user:TFullUser | null,
    loading:TLoading
    error:string| null
    jwt:string|null
    isInitialized:boolean
}

const initialState: IAuthState = {
  user: null,
  loading: "idle",
  error: null,
  jwt: null,
  isInitialized: false,
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    resetUI: (state) => {
      state.loading = "idle";
      state.error = null;
    },
    Logout: (state) => {
      state.jwt = null;
      state.user = null;
      disconnectEcho();
    },
    setAccessToken: (state, action) => {
      state.jwt = action.payload.access_token;
      if (state.jwt) {
        initEcho(state.jwt);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      // SignUp
      .addCase(ActSignUp.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActSignUp.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(ActSignUp.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      // SignIn
      .addCase(ActSignIn.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActSignIn.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.jwt = action.payload.access_token;
        const partialUser = action.payload.user;
        state.user = {
          ...(state.user || {}),
          ...partialUser,
        } as TFullUser;

        if (state.jwt) {
          initEcho(state.jwt); // start Echo after login
        }
      })
      .addCase(ActSignIn.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      // Logout
      .addCase(ActLogout.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActLogout.fulfilled, (state) => {
        state.loading = "succeeded";
        state.user = null;
        state.jwt = null;
        state.error = null;
        disconnectEcho(); // 📴 stop Echo on logout
      })
      .addCase(ActLogout.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      // CheckAuth
      .addCase(ActCheckAuth.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActCheckAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.jwt = action.payload.access_token;
        state.isInitialized = true;
        state.loading = "succeeded";

        if (state.jwt) {
          initEcho(state.jwt); // 🔄 re-init Echo on refresh
        }
      })
      .addCase(ActCheckAuth.rejected, (state) => {
        console.log("AuthSlice: ActCheckAuth failed. Clearing auth state.");
        state.user = null;
        state.jwt = null;
        state.isInitialized = true;
        state.loading = "failed";
        disconnectEcho();
      })

      // OTP, Upload, Password flows (unchanged, just handling errors/loading)
      .addCase(ActSendOTP.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActSendOTP.fulfilled, (state) => {
        state.loading = "succeeded";
        state.error = null;
      })
      .addCase(ActSendOTP.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(ActReSendOTP.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActReSendOTP.fulfilled, (state) => {
        state.loading = "succeeded";
        state.error = null;
      })
      .addCase(ActReSendOTP.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(ActVerifyWhatsOTP.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActVerifyWhatsOTP.fulfilled, (state) => {
        state.loading = "succeeded";
        state.error = null;
      })
      .addCase(ActVerifyWhatsOTP.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(ActUploadId.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActUploadId.fulfilled, (state) => {
        state.loading = "succeeded";
        state.error = null;
      })
      .addCase(ActUploadId.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(ActforgetPass.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActforgetPass.fulfilled, (state) => {
        state.loading = "succeeded";
        state.error = null;
      })
      .addCase(ActforgetPass.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(ActResetPass.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActResetPass.fulfilled, (state) => {
        state.loading = "succeeded";
        state.error = null;
      })
      .addCase(ActResetPass.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })

      .addCase(ActGetUsersData.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActGetUsersData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(ActGetUsersData.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      });
  },
});
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
            
           if (typeof action.payload === "string") {
                state.error = action.payload;
                 toast.error(action.payload)
            }  
            else {
                state.error = "Something went wrong.";
                toast.error("Something went wrong.")
            }
        });
        builder.addCase(ActSignIn.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActSignIn.fulfilled,(state,action)=>{
            state.loading = "succeeded";
            state.jwt = action.payload.access_token;
            const partialUser = action.payload.user; 
            state.user = {
    
                ...(state.user || {}), 

                ...partialUser,
            } as TFullUser; 
        });
        builder.addCase(ActSignIn.rejected,(state,action)=>{
            state.loading = "failed";

            if (typeof action.payload === "string") {
                    state.error = action.payload;
                    toast.error(action.payload)
                }  
                else {
                    state.error = "Something went wrong.";
                    toast.error("Something went wrong.")
                }
        });
        builder.addCase(ActLogout.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActLogout.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.user = null;
            state.jwt = null;
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
            state.user = action.payload.user;
            state.jwt = action.payload.access_token; 

            state.isInitialized = true;
            state.loading = 'succeeded';
        })

        .addCase(ActCheckAuth.rejected, (state) => {
            console.log(" AuthSlice: ActCheckAuth failed. Clearing auth state.");
            state.user = null;
            state.jwt = null;
            state.isInitialized = true; 
            state.loading = 'failed';
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
        builder.addCase(ActReSendOTP.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActReSendOTP.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.error = null;
        });
        builder.addCase(ActReSendOTP.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActVerifyWhatsOTP.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActVerifyWhatsOTP.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.error = null;
        });
        builder.addCase(ActVerifyWhatsOTP.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActUploadId.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActUploadId.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.error = null;
        });
        builder.addCase(ActUploadId.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });

        builder.addCase(ActforgetPass.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActforgetPass.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.error = null;
        });
        builder.addCase(ActforgetPass.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActResetPass.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActResetPass.fulfilled,(state)=>{
            state.loading = "succeeded";
            state.error = null;
        });
        builder.addCase(ActResetPass.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActGetUsersData.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActGetUsersData.fulfilled,(state,action)=>{
            state.loading = "succeeded";
            
            state.user= action.payload;

            state.error = null;
        });
        builder.addCase(ActGetUsersData.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload ==="string"){
                state.error = action.payload;
            }
        });
        builder.addCase(ActChangePassword.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActChangePassword.fulfilled,(state)=>{
            state.loading = "succeeded";
            toast.success("Password changed successfully");
            state.error = null;
        });
        builder.addCase(ActChangePassword.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload === "string") {
                state.error = action.payload;
                 toast.error(action.payload)
            }  
            else {
                state.error = "Something went wrong.";
                toast.error("Something went wrong.")
            }
        });
        builder.addCase(ActChangeEmail.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActChangeEmail.fulfilled,(state)=>{
            state.loading = "succeeded";
            toast.success("Email changed successfully");
            state.error = null;
        });
        builder.addCase(ActChangeEmail.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload === "string") {
                state.error = action.payload;
                 toast.error(action.payload)
            }  
            else {
                state.error = "Something went wrong.";
                toast.error("Something went wrong.")
            }
        });
        builder.addCase(ActChangePhone.pending,(state)=>{
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(ActChangePhone.fulfilled,(state)=>{
            state.loading = "succeeded";
            toast.success("Phone changed successfully");
            state.error = null;
        });
        builder.addCase(ActChangePhone.rejected,(state,action)=>{
            state.loading = "failed";
            if (typeof action.payload === "string") {
                state.error = action.payload;
                 toast.error(action.payload)
            }  
            else {
                state.error = "Something went wrong.";
                toast.error("Something went wrong.")
            }
        });


    }
})

export default AuthSlice.reducer;
export const { resetUI, Logout, setAccessToken, setUser } = AuthSlice.actions;
