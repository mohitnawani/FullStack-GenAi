import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosclient";

const normalizeUser = (data) => {
  console.log("Normalizing user data:", data);
  const user = data?.user || data;
  if (!user) return null;
  return { ...user };
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  return fallback;
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return normalizeUser(response.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      console.log("Login response:", response.data);
      return normalizeUser(response.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Checking authentication...");
      const response = await axiosClient.get("/user/check");
      console.log("Auth check - user found:", response);
      return normalizeUser(response.data);
    } catch (error) {
      if (error?.response?.status === 401) return null;
      return rejectWithValue(getErrorMessage(error, "Auth check failed"));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
