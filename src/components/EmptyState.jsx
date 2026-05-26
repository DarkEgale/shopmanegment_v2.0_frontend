import { FiInbox } from "react-icons/fi";

const EmptyState = ({ title = "No data yet", text = "Create your first record to see it here." }) => (
  <div className="card grid place-items-center px-6 py-12 text-center">
    <FiInbox className="mb-3 text-slate-500" size={36} />
    <h3 className="text-base font-bold text-white">{title}</h3>
    <p className="mt-1 text-sm text-slate-400">{text}</p>
  </div>
);

export default EmptyState;
