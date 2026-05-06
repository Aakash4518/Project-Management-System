export const EmptyState = ({ title, description, action }) => (
  <div className="panel p-8 text-center">
    <div className="mx-auto h-16 w-16 rounded-3xl bg-emerald-500/10" />
    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
