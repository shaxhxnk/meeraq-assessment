import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProjects = createAsyncThunk(
  "project/getProjects",
  async ({ learnerId }, thunkAPI) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_BASE_URL}/api/projects/learner/${learnerId}/`,
      });
      if (response) {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.response.message });
    }
  }
);
