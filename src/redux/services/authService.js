import { createAsyncThunk } from "@reduxjs/toolkit";
import { notification } from "antd";
import axios from "axios";


export const login = createAsyncThunk(
  "user/login",
  async ({ email, password, csrf }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/login/`,
        {
          username: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
          },
          withCredentials: true,
        }
      );
      const data = response.data;
      
      return data;
    } catch (err) {
      notification.error({
        message: err?.response?.data?.detail
          ? err?.response?.data?.detail
          : "Something went wrong!",
      });
      return rejectWithValue({ error: err?.response?.data?.detail });
    }
  }
);

export const loginWithOtp = createAsyncThunk(
  "user/loginWithOtp",
  async ({ email, otp, csrf }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "POST",
        data: { email, otp },
        url: `${process.env.REACT_APP_BASE_URL}/api/otp/validate/`,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
      });
      if (response) {
        
        notification.success({ message: "Logged in successfully" });
     
        return response.data;
      }
    } catch (error) {
      notification.error({
        message: error?.response?.data?.detail
          ? error?.response?.data?.detail
          : "Something went wrong!",
      });
      return rejectWithValue({ error: error.response.data.error });
    }
  }
);

export const getSession = createAsyncThunk(
  "user/getSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/session/`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      return data;
    } catch (err) {
      return rejectWithValue("Error");
    }
  }
);


export const getCSRF = createAsyncThunk(
  "user/getCsrf",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/csrf/`,
        {
          withCredentials: true,
        }
      );
      const csrfToken = response.headers["x-csrftoken"];
      return csrfToken;
    } catch (err) {
      return rejectWithValue("err");
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { createAsyncThunk }) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_BASE_URL}/api/logout/`,
        withCredentials: true,
      });
      if (response.status === 200) {
        return;
      } else {
        throw new Error(`Failed to logout: ${response.status}`);
      }
    } catch (error) {
      return createAsyncThunk("Error in logout");
    }
  }
);
