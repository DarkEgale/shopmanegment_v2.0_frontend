import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import salesReducer from "../features/sales/salesSlice";
import statisticsReducer from "../features/statistics/statisticsSlice";
import uiReducer from "../features/auth/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: salesReducer,
    statistics: statisticsReducer,
    ui: uiReducer,
  },
});
