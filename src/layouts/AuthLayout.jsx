import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <main className="min-h-screen bg-slate-950 text-white">
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_420px]">
      <section>
        <p className="text-sm font-bold uppercase tracking-widest text-teal-300">Inventory SaaS</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-6xl">Run every product, sale, and profit number from one tenant-safe workspace.</h1>
        <p className="mt-5 max-w-xl text-base text-slate-300">Premium shop operations for owners who need stock accuracy, invoice speed, and clean reporting.</p>
      </section>
      <Outlet />
    </div>
  </main>
);

export default AuthLayout;
