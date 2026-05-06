import dayjs from "dayjs";

export const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const formatDate = (date) => (date ? dayjs(date).format("DD MMM YYYY") : "No date");

export const statusTone = (value) => {
  const tones = {
    done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    "in-progress": "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    active: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    review: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    todo: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    backlog: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
    planning: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200",
    critical: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
    high: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  };
  return tones[value] || "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200";
};
