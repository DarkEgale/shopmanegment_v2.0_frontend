import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPrinter, FiSearch, FiUsers } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { fetchUnpaidSales } from "../features/sales/salesSlice";
import { useDebounce } from "../hooks/useDebounce";
import { date, money } from "../utils/format";
import { printSaleInvoice } from "../utils/print";

const UnpaidSales = () => {
  const dispatch = useDispatch();
  const { unpaidItems, loading } = useSelector((state) => state.sales);
  const shopName = useSelector((state) => state.auth.user?.shopName);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchUnpaidSales({ search: debouncedSearch || undefined }));
  }, [dispatch, debouncedSearch]);

  const visibleItems = useMemo(() => unpaidItems, [unpaidItems]);

  return (
    <>
      <PageHeader title="Unpaid Sales" subtitle="Invoices with remaining customer dues." action={<Link className="btn btn-primary" to="/unpaid/customers"><FiUsers /> Customer Totals</Link>} />
      <div className="card mb-5 p-4">
        <label className="relative block">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input className="input pl-10" placeholder="Search invoice, customer, address, product, SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>
      {loading ? <Skeleton rows={6} /> : visibleItems.length === 0 ? <EmptyState title="No unpaid sales found" text="Partial and unpaid invoices will appear here." /> : (
        <div className="space-y-4">
          {visibleItems.map((sale) => (
            <section key={sale._id} className="card overflow-hidden">
              <div className="grid gap-3 border-b border-slate-800 p-4 text-sm md:grid-cols-6">
                <div><p className="label">Invoice</p><p className="font-bold text-white">{sale.invoiceNumber}</p></div>
                <div><p className="label">Customer</p><p className="font-bold text-white">{sale.customerName}</p></div>
                <div><p className="label">Address</p><p>{sale.address || sale.note || "-"}</p></div>
                <div><p className="label">Paid</p><p>{money(sale.paidAmount)}</p></div>
                <div><p className="label">Due</p><p className="font-bold text-rose-300">{money(sale.dueAmount)}</p></div>
                <div className="flex items-start justify-between gap-3"><div><p className="label">Date</p><p>{date(sale.createdAt)}</p></div><button type="button" className="btn btn-ghost px-2" title="Print invoice" onClick={() => printSaleInvoice({ sale, items: sale.items, shopName })}><FiPrinter /></button></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-900 text-xs uppercase text-slate-400"><tr><th className="px-4 py-3">Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                  <tbody className="divide-y divide-slate-800">
                    {sale.items.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-900/70">
                        <td className="px-4 py-3 font-bold text-white">{item.productName}</td>
                        <td>{item.productSku}</td>
                        <td>{item.quantity}</td>
                        <td>{money(item.sellingPrice)}</td>
                        <td>{money(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
};

export default UnpaidSales;
