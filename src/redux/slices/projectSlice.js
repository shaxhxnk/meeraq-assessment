import { createSlice } from "@reduxjs/toolkit";
import { getProjects } from "../services/projectService";

const initialState = {
  projects: null,
  error: null,
  isLoading: false,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action?.payload
          ? action?.payload?.error
          : "Something went wrong";
      });
  },
});

export default projectSlice.reducer;
