import { initials } from "../../utils/helpers";

export const Avatar = ({ name, className = "" }) => (
  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-xs font-bold text-white dark:bg-emerald-500 ${className}`}>
    {initials(name)}
  </div>
);
