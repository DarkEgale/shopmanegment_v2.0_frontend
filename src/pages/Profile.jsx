import { useSelector } from "react-redux";
import PageHeader from "../components/PageHeader";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      <PageHeader title="Profile" subtitle="Your shop and account details." />
      <div className="card max-w-2xl p-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold text-slate-400">Name</dt><dd className="mt-1 font-bold text-white">{user?.name}</dd></div>
          <div><dt className="text-sm font-semibold text-slate-400">Email</dt><dd className="mt-1 font-bold text-white">{user?.email}</dd></div>
          <div><dt className="text-sm font-semibold text-slate-400">Shop</dt><dd className="mt-1 font-bold text-white">{user?.shopName}</dd></div>
          <div><dt className="text-sm font-semibold text-slate-400">Role</dt><dd className="mt-1 font-bold text-white">{user?.role}</dd></div>
        </dl>
      </div>
    </>
  );
};

export default Profile;
