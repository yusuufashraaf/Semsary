// src/store/Auth/AuthSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { TLoading } from "src/types";
import { TFullUser } from "src/types/users/users.types";
import { initEcho, disconnectEcho } from "@services/echoManager";

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
import ActGetUsersData from "./Act/ActGetUsersData";
import ActChangePassword from "./Act/ActChangePassword";
import ActChangeEmail from "./Act/ActChangeEmail";
import ActChangePhone from "./Act/ActChangePhone";

interface IAuthState {
  user: TFullUser | null;
  loading: TLoading;
  error: string | null;
  jwt: string | null;
  isInitialized: boolean;
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
      if (state.jwt) initEcho(state.jwt);
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    // SignUp
    builder
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
        state.error = typeof action.payload === "string" ? action.payload : "Something went wrong.";
        toast.error(state.error);
      });

    // SignIn
    builder
      .addCase(ActSignIn.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActSignIn.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.jwt = action.payload.access_token;
        const partialUser = action.payload.user;
        state.user = { ...(state.user || {}), ...partialUser } as TFullUser;
        if (state.jwt) initEcho(state.jwt);
      })
      .addCase(ActSignIn.rejected, (state, action) => {
        state.loading = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Something went wrong.";
        toast.error(state.error);
      });

    // Logout
    builder
      .addCase(ActLogout.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActLogout.fulfilled, (state) => {
        state.loading = "succeeded";
        state.user = null;
        state.jwt = null;
        state.error = null;
        disconnectEcho();
      })
      .addCase(ActLogout.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    // CheckAuth
    builder
      .addCase(ActCheckAuth.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActCheckAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.jwt = action.payload.access_token;
        state.isInitialized = true;
        state.loading = "succeeded";
        if (state.jwt) initEcho(state.jwt);
      })
      .addCase(ActCheckAuth.rejected, (state) => {
        console.log("AuthSlice: ActCheckAuth failed. Clearing auth state.");
        state.user = null;
        state.jwt = null;
        state.isInitialized = true;
        state.loading = "failed";
        disconnectEcho();
      });

    // OTP
    builder
      .addCase(ActSendOTP.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActSendOTP.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(ActSendOTP.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    builder
      .addCase(ActReSendOTP.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActReSendOTP.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(ActReSendOTP.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    builder
      .addCase(ActVerifyWhatsOTP.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActVerifyWhatsOTP.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(ActVerifyWhatsOTP.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    // Upload ID
    builder
      .addCase(ActUploadId.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActUploadId.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(ActUploadId.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    // Password reset
    builder
      .addCase(ActforgetPass.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActforgetPass.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(ActforgetPass.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    builder
      .addCase(ActResetPass.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActResetPass.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(ActResetPass.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    // Get users data
    builder
      .addCase(ActGetUsersData.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActGetUsersData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
      })
      .addCase(ActGetUsersData.rejected, (state, action) => {
        state.loading = "failed";
        if (typeof action.payload === "string") state.error = action.payload;
      });

    // Change password
    builder
      .addCase(ActChangePassword.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActChangePassword.fulfilled, (state) => {
        state.loading = "succeeded";
        toast.success("Password changed successfully");
      })
      .addCase(ActChangePassword.rejected, (state, action) => {
        state.loading = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Something went wrong.";
        toast.error(state.error);
      });

    // Change email
    builder
      .addCase(ActChangeEmail.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActChangeEmail.fulfilled, (state) => {
        state.loading = "succeeded";
        toast.success("Email changed successfully");
      })
      .addCase(ActChangeEmail.rejected, (state, action) => {
        state.loading = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Something went wrong.";
        toast.error(state.error);
      });

    // Change phone
    builder
      .addCase(ActChangePhone.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(ActChangePhone.fulfilled, (state) => {
        state.loading = "succeeded";
        toast.success("Phone changed successfully");
      })
      .addCase(ActChangePhone.rejected, (state, action) => {
        state.loading = "failed";
        state.error = typeof action.payload === "string" ? action.payload : "Something went wrong.";
        toast.error(state.error);
      });
  },
});

export default AuthSlice.reducer;
export const { resetUI, Logout, setAccessToken, setUser } = AuthSlice.actions;
