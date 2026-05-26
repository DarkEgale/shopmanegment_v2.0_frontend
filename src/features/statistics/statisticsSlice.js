import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchStatistics = createAsyncThunk("statistics/fetch", async () => {
  const { data } = await api.get("/statistics");
  return data.data.statistics;
});

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: { data: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default statisticsSlice.reducer;
