import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearCurrentProduct, createProduct, fetchProduct, updateProduct } from "../features/products/productSlice";
import PageHeader from "../components/PageHeader";

const fields = [
  ["name", "Name"], ["sku", "SKU"], ["category", "Category"], ["supplierName", "Supplier"],
  ["buyingPrice", "Buying Price", "number"], ["sellingPrice", "Selling Price", "number"], ["quantity", "Quantity", "number"], ["lowStockLimit", "Low Stock Limit", "number"],
];

const defaultValues = {
  name: "",
  sku: "",
  category: "",
  supplierName: "",
  buyingPrice: 0,
  sellingPrice: 0,
  quantity: 0,
  lowStockLimit: 5,
};

const productToFormValues = (product) => ({
  name: product?.name || "",
  sku: product?.sku || "",
  category: product?.category || "",
  supplierName: product?.supplierName || "",
  buyingPrice: product?.buyingPrice ?? 0,
  sellingPrice: product?.sellingPrice ?? 0,
  quantity: product?.quantity ?? 0,
  lowStockLimit: product?.lowStockLimit ?? 5,
});

const ProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.products);
  const formValues = useMemo(() => (id && current?._id === id ? productToFormValues(current) : defaultValues), [current, id]);
  const { register, handleSubmit } = useForm({ defaultValues, values: formValues });

  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  const onSubmit = async (values) => {
    const payload = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, ["buyingPrice", "sellingPrice", "quantity", "lowStockLimit"].includes(key) ? Number(value) : value]));
    if (id) await dispatch(updateProduct({ id, payload })).unwrap();
    else await dispatch(createProduct(payload)).unwrap();
    navigate("/products");
  };

  return (
    <>
      <PageHeader title={id ? "Edit Product" : "Create Product"} subtitle="Keep product pricing and stock limits accurate." />
      <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-4 p-5 md:grid-cols-2">
        {fields.map(([name, label, type = "text"]) => (
          <label key={name} className="block"><span className="label">{label}</span><input className="input mt-1" type={type} step="0.01" {...register(name, { required: true })} /></label>
        ))}
        <div className="md:col-span-2"><button className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Product"}</button></div>
      </form>
    </>
  );
};

export default ProductForm;
