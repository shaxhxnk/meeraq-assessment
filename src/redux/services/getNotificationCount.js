import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getNotificationCount = createAsyncThunk(
  "getNotificationCount",
  async (user, thunkAPI) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_BASE_URL}/api/notifications/unread-count/${user}/`,
      });
      if (response) {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.response.message });
    }
  }
);
