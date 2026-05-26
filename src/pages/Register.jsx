import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((values) => dispatch(registerUser(values)))} className="rounded-lg border border-slate-800 bg-slate-950/90 p-6 text-slate-100 shadow-xl shadow-black/30">
      <h2 className="text-2xl font-black">Create account</h2>
      <div className="mt-6 space-y-4">
        <label className="block"><span className="label">Name</span><input className="input mt-1" {...register("name", { required: true })} /></label>
        <label className="block"><span className="label">Shop name</span><input className="input mt-1" {...register("shopName", { required: true })} /></label>
        <label className="block"><span className="label">Email</span><input className="input mt-1" type="email" {...register("email", { required: true })} /></label>
        <label className="block"><span className="label">Password</span><input className="input mt-1" type="password" {...register("password", { required: true, minLength: 6 })} /></label>
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </div>
      <p className="mt-5 text-center text-sm text-slate-400">Have an account? <Link className="font-bold text-teal-300" to="/login">Login</Link></p>
    </form>
  );
};

export default Register;
