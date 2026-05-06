export const BarChart = ({ data }) => (
  <div className="panel p-6">
    <div className="flex items-center justify-between">
      <h3 className="font-display text-xl font-bold">Task Pipeline</h3>
      <span className="text-xs text-slate-500 dark:text-slate-400">Live by status</span>
    </div>
    <div className="mt-8 flex h-52 items-end gap-4">
      {data.map((item, index) => (
        <div key={item.status} className="flex flex-1 flex-col items-center gap-3">
          <div
            className={`w-full rounded-t-3xl bg-gradient-to-t ${
              index % 2 === 0 ? "from-emerald-500 to-emerald-300" : "from-orange-500 to-amber-300"
            }`}
            style={{ height: `${Math.max(item.value * 18, 16)}px` }}
          />
          <div className="text-center">
            <p className="text-xs font-semibold capitalize">{item.status}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
