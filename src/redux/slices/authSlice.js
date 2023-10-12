import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  getSession,
  getCSRF,
  logout,
  loginWithOtp,
} from "../services/authService";

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: true,
  csrf: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Something went wrong";
      })
      .addCase(loginWithOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Something went wrong";
      })
      .addCase(getSession.pending, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = true;
        state.error = false;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        if (action.payload.isAuthenticated) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.isLoading = false;
          state.error = false;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.isLoading = false;
          state.error = false;
        }
      })
      .addCase(getSession.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = false;
      })
      .addCase(getCSRF.pending, (state, action) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(getCSRF.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.csrf = action.payload;
      })
      .addCase(getCSRF.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = false;
        state.isAuthenticated = false;
        state.csrf = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { updateUser } = authSlice.actions;

export default authSlice.reducer;
