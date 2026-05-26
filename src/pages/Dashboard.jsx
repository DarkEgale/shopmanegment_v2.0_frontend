import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiActivity, FiBox, FiDollarSign, FiShoppingBag } from "react-icons/fi";
import { fetchStatistics } from "../features/statistics/statisticsSlice";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import { money } from "../utils/format";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.statistics);
  const shopName = useSelector((state) => state.auth.user?.shopName);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  const stockPie = useMemo(() => [
    { name: "Low stock", value: data?.lowStockProducts?.length || 0 },
    { name: "Out of stock", value: data?.outOfStockProducts?.length || 0 },
    { name: "Available", value: Math.max((data?.productCount || 0) - (data?.lowStockProducts?.length || 0), 0) },
  ], [data]);

  if (loading && !data) return <Spinner />;

  return (
    <>
      <PageHeader title={shopName || "Dashboard"} subtitle="Sales, stock, profit, and supplier performance." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Revenue" value={money(data?.revenue)} icon={FiDollarSign} />
        <StatCard title="Orders" value={data?.orders || 0} icon={FiShoppingBag} />
        <StatCard title="Current Stock" value={data?.currentStock || 0} icon={FiBox} />
        <StatCard title="Actual Profit" value={money(data?.actualSalesProfit)} icon={FiActivity} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Sales Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data?.weeklySales || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis /><Tooltip /><Area type="monotone" dataKey="sales" stroke="#0f766e" fill="#ccfbf1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Stock Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={stockPie} dataKey="value" nameKey="name" outerRadius={100} fill="#0f766e" label /><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Profit Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.monthlySales || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis /><Tooltip /><Bar dataKey="profit" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Supplier Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.topSuppliers || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="_id" /><YAxis /><Tooltip /><Bar dataKey="buyingValue" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
