const Skeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-800" />
    ))}
  </div>
);

export default Skeleton;
