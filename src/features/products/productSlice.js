import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import { setToast } from "../auth/uiSlice";

export const fetchProducts = createAsyncThunk("products/fetch", async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return { products: data.data.products, meta: data.meta };
});

export const fetchProduct = createAsyncThunk("products/fetchOne", async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data.product;
});

export const createProduct = createAsyncThunk("products/create", async (payload, { dispatch }) => {
  const { data } = await api.post("/products", payload);
  dispatch(setToast({ type: "success", message: "Product saved" }));
  return data.data.product;
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, payload }, { dispatch }) => {
  const { data } = await api.put(`/products/${id}`, payload);
  dispatch(setToast({ type: "success", message: "Product updated" }));
  return data.data.product;
});

export const deleteProduct = createAsyncThunk("products/delete", async (id, { dispatch }) => {
  await api.delete(`/products/${id}`);
  dispatch(setToast({ type: "success", message: "Product deleted" }));
  return id;
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], current: null, meta: {}, loading: false },
  reducers: { clearCurrentProduct: (state) => { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addMatcher((action) => action.type.startsWith("products/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.startsWith("products/") && action.type.endsWith("/rejected"), (state) => {
        state.loading = false;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
