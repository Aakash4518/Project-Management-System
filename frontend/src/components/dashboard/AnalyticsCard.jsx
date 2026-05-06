export const AnalyticsCard = ({ label, value, delta, accent }) => (
  <div className="panel p-5">
    <div className={`h-2 w-16 rounded-full ${accent}`} />
    <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <div className="mt-2 flex items-end justify-between gap-4">
      <p className="font-display text-3xl font-bold">{value}</p>
      <p className="text-xs font-semibold text-emerald-500">{delta}</p>
    </div>
  </div>
);
