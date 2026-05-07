import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "../../components/common/Avatar";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/SkeletonCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useFetch } from "../../hooks/useFetch";
import { formatDate } from "../../utils/helpers";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="panel p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-display text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const getAssigneeNames = (task) => {
  const assignees = task.assignees?.length ? task.assignees : task.assignee ? [task.assignee] : [];
  return assignees.map((assignee) => assignee?.name).filter(Boolean).join(", ") || "Unassigned";
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/projects/${id}`, [id]);

  if (loading) {
    return (
      <div className="grid gap-4">
        <SkeletonCard className="h-56" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="panel p-8 text-sm text-rose-500">{error}</div>;
  }

  const project = data?.project;
  if (!project) {
    return <EmptyState title="Project not found" description="This project could not be loaded." />;
  }

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold">{project.name}</h1>
              <StatusBadge tone={project.status}>{project.status}</StatusBadge>
              <StatusBadge tone={project.priority}>{project.priority}</StatusBadge>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              {project.description || "No project description provided yet."}
            </p>
          </div>
          <div className="min-w-72 rounded-3xl bg-slate-900 p-5 text-white dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Project Progress</p>
            <p className="mt-3 font-display text-5xl font-bold">{project.progress}%</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} />
            </div>
            <p className="mt-3 text-xs text-slate-300">
              {project.taskSummary.completed} of {project.taskSummary.total} tasks completed
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Completed Tasks" value={project.taskSummary.completed} />
        <StatCard icon={Clock3} label="Pending Tasks" value={project.taskSummary.pending} />
        <StatCard icon={CalendarDays} label="Overdue Tasks" value={project.taskSummary.overdue} />
        <StatCard icon={Users} label="Team Members" value={project.members?.length || 0} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="panel p-6">
          <h2 className="font-display text-2xl font-bold">Team</h2>
          <div className="mt-6 space-y-4">
            {(project.members || []).length ? (
              project.members.map((member) => (
                <div key={member._id} className="flex items-center gap-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <Avatar name={member.name} />
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {member.role} • {member.title || "Team member"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No members assigned" description="This project does not have any assigned members yet." />
            )}
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 p-4 text-sm dark:border-slate-800">
            <p className="font-semibold">Owner</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{project.owner?.name || "Unknown"}</p>
            <p className="mt-4 font-semibold">Due Date</p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{formatDate(project.dueDate)}</p>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Project Tasks</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">{project.tasks.length} total</span>
          </div>
          <div className="mt-6 space-y-4">
            {project.tasks.length ? (
              project.tasks.map((task) => (
                <article key={task._id} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {task.description || "No task description provided."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={task.status}>{task.status}</StatusBadge>
                      <StatusBadge tone={task.priority}>{task.priority}</StatusBadge>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-500 dark:text-slate-400 md:grid-cols-3">
                    <p>Assignees: <span className="font-semibold text-slate-800 dark:text-slate-100">{getAssigneeNames(task)}</span></p>
                    <p>Reporter: <span className="font-semibold text-slate-800 dark:text-slate-100">{task.reporter?.name || "Unknown"}</span></p>
                    <p>Due: <span className="font-semibold text-slate-800 dark:text-slate-100">{formatDate(task.dueDate)}</span></p>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState title="No tasks in this project" description="Tasks assigned to this project will appear here." />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
