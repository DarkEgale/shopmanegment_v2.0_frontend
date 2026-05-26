import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiPrinter, FiSearch } from "react-icons/fi";
import api from "../services/api";
import { fetchSales } from "../features/sales/salesSlice";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { date, money } from "../utils/format";
import { printSaleInvoice } from "../utils/print";

const Sales = () => {
  const dispatch = useDispatch();
  const { items, loading, meta } = useSelector((state) => state.sales);
  const shopName = useSelector((state) => state.auth.user?.shopName);
  const [filters, setFilters] = useState({ search: "", page: 1 });
  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    dispatch(fetchSales({ page: filters.page, search: debouncedSearch || undefined }));
  }, [dispatch, debouncedSearch, filters.page]);

  const printSale = async (saleId) => {
    const { data } = await api.get(`/sales/${saleId}`);
    printSaleInvoice({ ...data.data, shopName });
  };

  return (
    <>
      <PageHeader title="Sales" subtitle="Invoices and payment history." action={<Link className="btn btn-primary" to="/sales/create"><FiPlus /> Create Sale</Link>} />
      <div className="card mb-5 p-4">
        <label className="relative block">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input className="input pl-10" placeholder="Search invoice, customer, address, product, SKU" value={filters.search} onChange={(e) => setFilters({ search: e.target.value, page: 1 })} />
        </label>
      </div>
      {loading ? <Skeleton rows={6} /> : items.length === 0 ? <EmptyState title="No sales yet" text="Create a sale to update stock automatically." /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400"><tr><th className="px-4 py-3">Invoice</th><th>Customer</th><th>Address</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Sold By</th><th>Date</th><th className="px-4">Print</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((sale) => <tr key={sale._id} className="hover:bg-slate-900/70"><td className="px-4 py-3 font-bold">{sale.invoiceNumber}</td><td>{sale.customerName}</td><td>{sale.address || sale.note || "-"}</td><td>{money(sale.totalAmount)}</td><td>{money(sale.paidAmount ?? sale.totalAmount)}</td><td className="font-bold text-rose-300">{money(sale.dueAmount)}</td><td>{sale.paymentStatus || "paid"}</td><td>{sale.soldBy}</td><td>{date(sale.createdAt)}</td><td className="px-4"><button type="button" className="btn btn-ghost px-2" title="Print invoice" onClick={() => printSale(sale._id)}><FiPrinter /></button></td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 p-4 text-sm text-slate-400">
            <span>Page {meta?.page || 1} of {meta?.pages || 1}</span>
            <div className="flex gap-2"><button className="btn btn-ghost" disabled={(meta?.page || 1) <= 1} onClick={() => setFilters((x) => ({ ...x, page: x.page - 1 }))}>Prev</button><button className="btn btn-ghost" disabled={(meta?.page || 1) >= (meta?.pages || 1)} onClick={() => setFilters((x) => ({ ...x, page: x.page + 1 }))}>Next</button></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sales;
