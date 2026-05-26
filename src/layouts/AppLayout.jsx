import { useCallback, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiBarChart2, FiBox, FiCreditCard, FiGrid, FiLogOut, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { logoutUser } from "../features/auth/authSlice";

const links = [
  { to: "/", label: "Dashboard", icon: FiGrid },
  { to: "/products", label: "Products", icon: FiBox },
  { to: "/sales", label: "Sales", icon: FiShoppingCart },
  { to: "/unpaid", label: "Unpaid", icon: FiCreditCard },
  { to: "/statistics", label: "Statistics", icon: FiBarChart2 },
  { to: "/profile", label: "Profile", icon: FiUser },
];

const Sidebar = ({ open, onClose, shopName }) => (
  <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-950 p-5 transition lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-black text-white">{shopName || "Inventory SaaS"}</p>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Control Center</p>
      </div>
      <button className="btn btn-ghost px-2 lg:hidden" onClick={onClose}><FiX /></button>
    </div>
    <nav className="mt-8 space-y-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-teal-500/15 text-teal-300" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate("/login");
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      <Sidebar open={open} onClose={() => setOpen(false)} shopName={user?.shopName} />
      {open && <button aria-label="Close sidebar" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <button className="btn btn-ghost px-2 lg:hidden" onClick={() => setOpen(true)}><FiMenu /></button>
            <div>
              <p className="text-sm font-bold text-white">{user?.shopName}</p>
              <p className="text-xs text-slate-400">{user?.name}</p>
            </div>
            <button className="btn btn-ghost" onClick={handleLogout}><FiLogOut /> Logout</button>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
