export const FormField = ({ label, error, children }) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    {children}
    {error ? <p className="text-xs text-rose-500">{error}</p> : null}
  </label>
);
