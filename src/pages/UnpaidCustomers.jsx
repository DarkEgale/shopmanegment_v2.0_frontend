import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiList, FiPrinter, FiSearch } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { fetchUnpaidCustomers } from "../features/sales/salesSlice";
import { useDebounce } from "../hooks/useDebounce";
import { date, money } from "../utils/format";
import { printCustomerDues } from "../utils/print";

const UnpaidCustomers = () => {
  const dispatch = useDispatch();
  const { unpaidCustomers, loading } = useSelector((state) => state.sales);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchUnpaidCustomers({ search: debouncedSearch || undefined }));
  }, [dispatch, debouncedSearch]);

  const totalUnpaid = unpaidCustomers.reduce((sum, customer) => sum + Number(customer.totalUnpaid || 0), 0);

  return (
    <>
      <PageHeader title="Customer Dues" subtitle={`Total unpaid: ${money(totalUnpaid)}`} action={<div className="flex flex-wrap gap-2"><button type="button" className="btn btn-ghost" onClick={() => printCustomerDues(unpaidCustomers)}><FiPrinter /> Print</button><Link className="btn btn-primary" to="/unpaid"><FiList /> Unpaid Sales</Link></div>} />
      <div className="card mb-5 p-4">
        <label className="relative block">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input className="input pl-10" placeholder="Search customer dues" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
      </div>
      {loading ? <Skeleton rows={6} /> : unpaidCustomers.length === 0 ? <EmptyState title="No customer dues" text="Customers with unpaid balances will appear here." /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase text-slate-400"><tr><th className="px-4 py-3">Customer</th><th>Invoices</th><th>Total Billed</th><th>Paid</th><th>Unpaid</th><th>Last Sale</th></tr></thead>
            <tbody className="divide-y divide-slate-800">
              {unpaidCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-900/70">
                  <td className="px-4 py-3 font-bold text-white">{customer._id || "Walk-in Customer"}</td>
                  <td>{customer.invoices}</td>
                  <td>{money(customer.totalBilled)}</td>
                  <td>{money(customer.totalPaid)}</td>
                  <td className="font-bold text-rose-300">{money(customer.totalUnpaid)}</td>
                  <td>{date(customer.lastSaleAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UnpaidCustomers;
