const Spinner = ({ full = false }) => (
  <div className={full ? "grid min-h-screen place-items-center bg-slate-950" : "grid min-h-40 place-items-center"}>
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-teal-400" />
  </div>
);

export default Spinner;
