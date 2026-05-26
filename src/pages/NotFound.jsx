import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-center">
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-teal-300">404</p>
      <h1 className="mt-2 text-4xl font-black text-white">Page not found</h1>
      <Link className="btn btn-primary mt-6" to="/">Back to dashboard</Link>
    </div>
  </main>
);

export default NotFound;
