import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { deleteProduct, fetchProducts } from "../features/products/productSlice";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { money } from "../utils/format";

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading, meta } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({ search: "", stock: "", page: 1 });
  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, search: debouncedSearch || undefined, stock: filters.stock || undefined }));
  }, [dispatch, debouncedSearch, filters.stock, filters.page]);

  const remove = useCallback((id) => {
    if (confirm("Delete this product?")) dispatch(deleteProduct(id));
  }, [dispatch]);

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage stock, prices, suppliers, low-stock limits, and SKUs."
        action={<Link className="btn btn-primary" to="/products/create"><FiPlus /> New Product</Link>}
      />
      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-[1fr_180px]">
        <label className="relative">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input className="input pl-10" placeholder="Search products, SKU, category, supplier" value={filters.search} onChange={(e) => setFilters((x) => ({ ...x, search: e.target.value, page: 1 }))} />
        </label>
        <select className="input" value={filters.stock} onChange={(e) => setFilters((x) => ({ ...x, stock: e.target.value, page: 1 }))}>
          <option value="">All stock</option><option value="available">Available</option><option value="low">Low stock</option><option value="out">Out of stock</option>
        </select>
      </div>
      {loading ? <Skeleton rows={6} /> : items.length === 0 ? <EmptyState title="No products found" /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                <tr><th className="px-4 py-3">Product</th><th>SKU</th><th>Category</th><th>Supplier</th><th>Buying</th><th>Selling</th><th>Qty</th><th>Status</th><th className="px-4">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/70">
                    <td className="px-4 py-3 font-semibold">{item.name}</td><td>{item.sku}</td><td>{item.category}</td><td>{item.supplierName}</td><td>{money(item.buyingPrice)}</td><td>{money(item.sellingPrice)}</td><td>{item.quantity}</td>
                    <td><span className={`rounded-full px-2 py-1 text-xs font-bold ${item.quantity === 0 ? "bg-rose-500/15 text-rose-300" : item.quantity <= item.lowStockLimit ? "bg-amber-500/15 text-amber-300" : "bg-teal-500/15 text-teal-300"}`}>{item.quantity === 0 ? "Out" : item.quantity <= item.lowStockLimit ? "Low" : "Good"}</span></td>
                    <td className="px-4"><div className="flex gap-2"><Link className="btn btn-ghost px-2" to={`/products/${item._id}/edit`}><FiEdit2 /></Link><button className="btn btn-ghost px-2" onClick={() => remove(item._id)}><FiTrash2 /></button></div></td>
                  </tr>
                ))}
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

export default Products;
