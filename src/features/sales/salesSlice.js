import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { setToast } from "../auth/uiSlice";

export const fetchSales = createAsyncThunk("sales/fetch", async (params = {}) => {
  const { data } = await api.get("/sales", { params });
  return { sales: data.data.sales, meta: data.meta };
});

export const fetchUnpaidSales = createAsyncThunk("sales/fetchUnpaid", async (params = {}) => {
  const { data } = await api.get("/sales/unpaid", { params });
  return data.data.sales;
});

export const fetchUnpaidCustomers = createAsyncThunk("sales/fetchUnpaidCustomers", async (params = {}) => {
  const { data } = await api.get("/sales/unpaid/customers", { params });
  return data.data.customers;
});

export const createSale = createAsyncThunk("sales/create", async (payload, { dispatch }) => {
  const { data } = await api.post("/sales", payload);
  dispatch(setToast({ type: "success", message: `Invoice ${data.data.sale.invoiceNumber} created` }));
  return data.data;
});

const salesSlice = createSlice({
  name: "sales",
  initialState: { items: [], unpaidItems: [], unpaidCustomers: [], latest: null, meta: {}, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.sales;
        state.meta = action.payload.meta;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.loading = false;
        state.latest = action.payload;
        state.items.unshift(action.payload.sale);
      })
      .addCase(fetchUnpaidSales.fulfilled, (state, action) => {
        state.loading = false;
        state.unpaidItems = action.payload;
      })
      .addCase(fetchUnpaidCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.unpaidCustomers = action.payload;
      })
      .addMatcher((action) => action.type.startsWith("sales/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith("sales/") && action.type.endsWith("/rejected"), (state) => {
        state.loading = false;
      });
  },
});

export default salesSlice.reducer;
