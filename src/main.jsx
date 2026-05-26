import React, { Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";
import { fetchProfile } from "./features/auth/authSlice";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import Spinner from "./components/Spinner";
import Toast from "./components/Toast";
import "./index.css";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const ProductForm = lazy(() => import("./pages/ProductForm"));
const Sales = lazy(() => import("./pages/Sales"));
const CreateSale = lazy(() => import("./pages/CreateSale"));
const UnpaidSales = lazy(() => import("./pages/UnpaidSales"));
const UnpaidCustomers = lazy(() => import("./pages/UnpaidCustomers"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ProtectedRoute = ({ children }) => {
  const { user, bootstrapped } = useSelector((state) => state.auth);
  if (!bootstrapped) return <Spinner full />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, bootstrapped } = useSelector((state) => state.auth);
  if (!bootstrapped) return <Spinner full />;
  return user ? <Navigate to="/" replace /> : children;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<Spinner full />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          </Route>
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/create" element={<CreateSale />} />
            <Route path="/unpaid" element={<UnpaidSales />} />
            <Route path="/unpaid/customers" element={<UnpaidCustomers />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toast />
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
