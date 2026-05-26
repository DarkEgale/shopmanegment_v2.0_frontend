import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((values) => dispatch(loginUser(values)))} className="rounded-lg border border-slate-800 bg-slate-950/90 p-6 text-slate-100 shadow-xl shadow-black/30">
      <h2 className="text-2xl font-black">Login</h2>
      <div className="mt-6 space-y-4">
        <label className="block"><span className="label">Email</span><input className="input mt-1" type="email" {...register("email", { required: true })} /></label>
        <label className="block"><span className="label">Password</span><input className="input mt-1" type="password" {...register("password", { required: true })} /></label>
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </div>
      <p className="mt-5 text-center text-sm text-slate-400">No account? <Link className="font-bold text-teal-300" to="/register">Register</Link></p>
    </form>
  );
};

export default Login;
