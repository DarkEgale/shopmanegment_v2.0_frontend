import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../features/auth/uiSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(clearToast()), 3000);
    return () => clearTimeout(timer);
  }, [dispatch, toast]);

  if (!toast) return null;

  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold shadow-lg shadow-black/30">
      <span className={toast.type === "error" ? "text-rose-300" : "text-teal-300"}>{toast.message}</span>
    </div>
  );
};

export default Toast;
