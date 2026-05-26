import React from "react";

const tones = {
  teal: "bg-teal-500/15 text-teal-300",
  blue: "bg-blue-500/15 text-blue-300",
  amber: "bg-amber-500/15 text-amber-300",
  rose: "bg-rose-500/15 text-rose-300",
};

const StatCard = React.memo(({ title, value, icon: Icon, tone = "teal" }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      </div>
      {Icon && (
        <div className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone] || tones.teal}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  </div>
));

export default StatCard;
