import { useFetch } from "../../hooks/useFetch";
import { AnalyticsCard } from "../../components/dashboard/AnalyticsCard";
import { BarChart } from "../../components/charts/BarChart";
import { TimelineCard } from "../../components/dashboard/TimelineCard";
import { SkeletonCard } from "../../components/common/SkeletonCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/helpers";

export default function DashboardPage() {
  const { data, loading, error } = useFetch("/dashboard", []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} className="h-40" />
        ))}
      </div>
    );
  }

  if (error) return <div className="panel p-8 text-sm text-rose-500">{error}</div>;

  const analytics = data.analytics;

  return (
    <div className="space-y-4">
      <section className="panel overflow-hidden p-6">
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Overview</p>
            <h1 className="mt-3 font-display text-4xl font-bold">Calm control for busy teams.</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Track delivery, spot bottlenecks, and keep projects moving with clear ownership across your workspace.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[2rem] bg-slate-900 px-5 py-5 text-white shadow-soft dark:bg-slate-950">
              <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-300">Completion</p>
              <p className="mt-3 font-display text-4xl font-bold leading-none">{analytics.completionRate}%</p>
              <p className="mt-2 text-xs text-slate-300">Tasks finished across visible work</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white/75 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/75">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Overdue</p>
                <p className="mt-3 font-display text-4xl font-bold leading-none">{analytics.overdue}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Need attention</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white/75 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/75">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pending</p>
                <p className="mt-3 font-display text-4xl font-bold leading-none">{analytics.pending}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Still in motion</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Projects" value={analytics.projects} delta="+8%" accent="bg-emerald-500" />
        <AnalyticsCard label="Tasks" value={analytics.tasks} delta="+12%" accent="bg-orange-500" />
        <AnalyticsCard label="Team Members" value={analytics.teamMembers} delta="+4%" accent="bg-sky-500" />
        <AnalyticsCard label="Pending Tasks" value={analytics.pending} delta="Priority focus" accent="bg-violet-500" />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <BarChart data={data.taskStatusData} />
        <TimelineCard items={data.activity} />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold">Due Soon</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Next priorities</span>
          </div>
          <div className="mt-6 space-y-3">
            {data.dueSoon.map((task) => (
              <div key={task._id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.project?.name}</p>
                  </div>
                  <StatusBadge tone={task.priority}>{task.priority}</StatusBadge>
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Due {formatDate(task.dueDate)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold">Recent Tasks</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Latest movement</span>
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            {data.recentTasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 last:border-b-0 dark:border-slate-800">
                <div>
                  <p className="font-semibold">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.assignee?.name}</p>
                </div>
                <StatusBadge tone={task.status}>{task.status}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
