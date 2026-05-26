import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { setToast } from "./uiSlice";

export const registerUser = createAsyncThunk("auth/register", async (payload, { dispatch }) => {
  const { data } = await api.post("/auth/register", payload);
  dispatch(setToast({ type: "success", message: "Account created" }));
  return data.data.user;
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { dispatch }) => {
  const { data } = await api.post("/auth/login", payload);
  dispatch(setToast({ type: "success", message: "Welcome back" }));
  return data.data.user;
});

export const fetchProfile = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data.user;
  } catch (error) {
    return rejectWithValue(null);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  await api.post("/auth/logout");
  dispatch(setToast({ type: "success", message: "Logged out" }));
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, bootstrapped: false },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.bootstrapped = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.bootstrapped = true;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.bootstrapped = true;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addMatcher(
        (action) => ["auth/register/pending", "auth/login/pending", "auth/logout/pending"].includes(action.type),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => ["auth/register/fulfilled", "auth/login/fulfilled"].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
