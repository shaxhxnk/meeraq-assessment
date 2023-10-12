import { createSlice } from "@reduxjs/toolkit";
import { getNotificationCount } from "../services/getNotificationCount";
// import { getSessionRequestsCount } from "../services/getSessionRequestsCount";

const initialState = {
  notificationCount: null,
  error: null,
  isLoading: false,
};

export const notificaitonSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationCount.pending, (state) => {
        state.notificationCount = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotificationCount.fulfilled, (state, action) => {
        state.notificationCount = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getNotificationCount.rejected, (state, action) => {
        state.notificationCount = null;
        state.user = null;
        state.isLoading = false;
        state.error = action.payload
          ? action.payload.error
          : "Something went wrong";
      });
  },
});

export default notificaitonSlice.reducer;
