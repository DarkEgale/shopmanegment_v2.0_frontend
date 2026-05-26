import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { fetchProducts } from "../features/products/productSlice";
import { createSale } from "../features/sales/salesSlice";
import PageHeader from "../components/PageHeader";
import { useDebounce } from "../hooks/useDebounce";
import { money } from "../utils/format";

const CreateSale = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.sales.loading);
  const { register, handleSubmit, control } = useForm({ defaultValues: { paymentMethod: "cash", discount: 0 } });
  const [lines, setLines] = useState([{ productId: "", quantity: 1 }]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [paidAmount, setPaidAmount] = useState(0);
  const debouncedProductSearch = useDebounce(productSearch, 900);
  const productSearchQuery = debouncedProductSearch.trim();
  const discount = Number(useWatch({ control, name: "discount" }) || 0);

  useEffect(() => {
    if (productSearchQuery.length === 1) return;
    dispatch(fetchProducts({ limit: 100, stock: "available", search: productSearchQuery || undefined }));
  }, [dispatch, productSearchQuery]);

  const productOptions = useMemo(() => {
    const selectedIds = new Set(lines.map((line) => line.productId).filter(Boolean));
    const currentIds = new Set(products.map((product) => product._id));
    const retainedProducts = selectedProducts.filter((product) => selectedIds.has(product._id) && !currentIds.has(product._id));
    return [...retainedProducts, ...products];
  }, [lines, products, selectedProducts]);
  const selected = useMemo(() => lines.map((line) => ({ ...line, product: products.find((p) => p._id === line.productId) || selectedProducts.find((p) => p._id === line.productId) })), [lines, products, selectedProducts]);
  const total = useMemo(() => selected.reduce((sum, line) => sum + (line.product?.sellingPrice || 0) * Number(line.quantity || 0), 0), [selected]);
  const payableTotal = Math.max(total - discount, 0);
  const effectivePaidAmount = paymentStatus === "paid" ? payableTotal : paymentStatus === "unpaid" ? 0 : paidAmount;
  const dueAmount = Math.max(payableTotal - effectivePaidAmount, 0);

  const handlePaymentStatusChange = (event) => {
    const status = event.target.value;
    setPaymentStatus(status);
    if (status === "partial") setPaidAmount(0);
  };

  const updateLine = useCallback((index, key, value) => {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, [key]: value } : line)));
  }, []);

  const selectProduct = useCallback((index, productId) => {
    const product = productOptions.find((item) => item._id === productId);
    if (product) {
      setSelectedProducts((current) => (current.some((item) => item._id === product._id) ? current : [...current, product]));
    }
    updateLine(index, "productId", productId);
  }, [productOptions, updateLine]);

  const addSearchedProduct = useCallback((product) => {
    setSelectedProducts((current) => (current.some((item) => item._id === product._id) ? current : [...current, product]));
    setLines((current) => {
      const emptyIndex = current.findIndex((line) => !line.productId);
      if (emptyIndex >= 0) return current.map((line, index) => (index === emptyIndex ? { ...line, productId: product._id } : line));
      return [...current, { productId: product._id, quantity: 1 }];
    });
  }, []);

  const onSubmit = async (values) => {
    await dispatch(createSale({ ...values, paymentStatus, discount: Number(values.discount || 0), paidAmount: effectivePaidAmount, products: lines.filter((line) => line.productId).map((line) => ({ productId: line.productId, quantity: Number(line.quantity) })) })).unwrap();
    navigate("/sales");
  };

  return (
    <>
      <PageHeader title="Create Sale" subtitle="Multi-product checkout with automatic stock reduction." />
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="card p-5">
          <label className="relative mb-4 block">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input className="input pl-10" placeholder="Search products by name, SKU, category, supplier" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
          </label>
          {productSearch.trim().length === 1 ? (
            <p className="mb-4 text-sm text-slate-400">Type at least 2 characters to search.</p>
          ) : productSearchQuery ? (
            <div className="mb-4 max-h-64 overflow-y-auto rounded-lg border border-slate-800">
              {products.length === 0 ? (
                <p className="p-3 text-sm text-slate-400">No matching products found.</p>
              ) : (
                products.map((product) => (
                  <button key={product._id} type="button" className="flex w-full items-center justify-between gap-3 border-b border-slate-800 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-slate-900" onClick={() => addSearchedProduct(product)}>
                    <span><span className="font-semibold text-white">{product.name}</span><span className="ml-2 text-slate-400">{product.sku}</span></span>
                    <span className="shrink-0 text-slate-400">{product.quantity} in stock</span>
                  </button>
                ))
              )}
            </div>
          ) : null}
          <div className="space-y-3">
            {lines.map((line, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3 md:grid-cols-[1fr_120px_80px]">
                <select className="input" value={line.productId} onChange={(e) => selectProduct(index, e.target.value)}>
                  <option value="">Select product</option>
                  {productOptions.map((product) => <option key={product._id} value={product._id}>{product.name} - {product.quantity} in stock</option>)}
                </select>
                <input className="input" min="1" type="number" value={line.quantity} onChange={(e) => updateLine(index, "quantity", e.target.value)} />
                <button type="button" className="btn btn-ghost px-2" onClick={() => setLines((x) => x.filter((_, i) => i !== index))}><FiTrash2 /></button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-ghost mt-4" onClick={() => setLines((x) => [...x, { productId: "", quantity: 1 }])}><FiPlus /> Add Item</button>
        </div>
        <aside className="card h-fit p-5">
          <div className="space-y-4">
            <label className="block"><span className="label">Customer</span><input className="input mt-1" {...register("customerName")} placeholder="Walk-in Customer" /></label>
            <label className="block"><span className="label">Payment</span><select className="input mt-1" {...register("paymentMethod")}><option value="cash">Cash</option><option value="card">Card</option><option value="mobile_banking">Mobile Banking</option><option value="bank_transfer">Bank Transfer</option></select></label>
            <label className="block"><span className="label">Payment Status</span><select className="input mt-1" value={paymentStatus} onChange={handlePaymentStatusChange}><option value="paid">Paid</option><option value="partial">Partial</option><option value="unpaid">Unpaid</option></select></label>
            <label className="block"><span className="label">Discount</span><input className="input mt-1" type="number" step="0.01" {...register("discount")} /></label>
            <label className="block"><span className="label">Paid Amount</span><input className="input mt-1" type="number" step="0.01" value={effectivePaidAmount} disabled={paymentStatus !== "partial"} onChange={(event) => setPaidAmount(Number(event.target.value || 0))} /></label>
            <label className="block"><span className="label">Address</span><textarea className="input mt-1" rows="3" {...register("address")} /></label>
          </div>
          <div className="my-5 space-y-2 border-y border-slate-800 py-4 text-sm">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="flex items-center justify-between"><span>Payable</span><span>{money(payableTotal)}</span></div>
            <div className="flex items-center justify-between font-bold text-rose-300"><span>Due</span><span>{money(dueAmount)}</span></div>
          </div>
          <button className="btn btn-primary w-full" disabled={loading || lines.every((line) => !line.productId)}>{loading ? "Completing..." : "Complete Sale"}</button>
        </aside>
      </form>
    </>
  );
};

export default CreateSale;
