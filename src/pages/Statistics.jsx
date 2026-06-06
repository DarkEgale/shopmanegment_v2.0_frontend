import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchStatistics } from "../features/statistics/statisticsSlice";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import { money } from "../utils/format";

const Statistics = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  if (loading && !data) return <Spinner />;

  const radial = [
    { name: "Stock", value: data?.currentStock || 0, fill: "#0f766e" },
    { name: "Sold", value: data?.totalSoldProducts || 0, fill: "#2563eb" },
  ];

  return (
    <>
      <PageHeader
        title="Statistics"
        subtitle="Advanced tenant-safe MongoDB aggregation results."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Stock Buying Value"
          value={money(data?.totalStockBuyingValue)}
        />
        <StatCard
          title="Stock Selling Value"
          value={money(data?.totalStockSellingValue)}
        />
        <StatCard
          title="Expected Stock Profit"
          value={money(data?.expectedStockProfit)}
        />
        <StatCard title="Sales Profit" value={money(data?.actualSalesProfit)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Daily Sales</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.dailySales || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="sales" stroke="#0f766e" />
              <Line dataKey="profit" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.topSellingProducts || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Least Selling Products</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.leastSellingProducts || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Stock vs Sold</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart innerRadius="20%" outerRadius="90%" data={radial}>
              <RadialBar dataKey="value" />
              <Tooltip />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </section>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Low Stock Products</h2>
          <div className="space-y-2">
            {(data?.lowStockProducts || []).map((p) => (
              <div
                key={p._id}
                className="flex justify-between rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-100"
              >
                <span>{p.name}</span>
                <b>{p.quantity}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Out of Stock Products</h2>
          <div className="space-y-2">
            {(data?.outOfStockProducts || []).map((p) => (
              <div
                key={p._id}
                className="flex justify-between rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-100"
              >
                <span>{p.name}</span>
                <b>{p.sku}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Statistics;
