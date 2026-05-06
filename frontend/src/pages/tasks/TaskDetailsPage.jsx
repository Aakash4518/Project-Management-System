import { ArrowLeft, CalendarDays, CheckCircle2, ClipboardList, MessageSquare, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/client";
import { Avatar } from "../../components/common/Avatar";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/SkeletonCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useFetch } from "../../hooks/useFetch";
import { formatDate } from "../../utils/helpers";

const MetaCard = ({ icon: Icon, label, value }) => (
  <div className="panel p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default function TaskDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const { data, loading, error, setData } = useFetch(`/tasks/${id}`, [id]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const task = data?.task;
  const canUpdateStatus =
    task &&
    (["admin", "manager"].includes(user?.role) || task.assignee?._id === user?.id);

  const handleStatusUpdate = async (status) => {
    setSubmitting(true);
    try {
      const response = await api.put(`/tasks/${id}`, { status });
      setData({ task: response.data.data.task });
      pushToast({ title: "Task updated", description: `Status changed to ${status}.` });
    } catch (err) {
      pushToast({ title: "Update failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const response = await api.post(`/tasks/${id}/comments`, { message: comment });
      setData({ task: response.data.data.task });
      setComment("");
      pushToast({ title: "Comment added", description: "Task discussion updated." });
    } catch (err) {
      pushToast({ title: "Comment failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (error) return <div className="panel p-8 text-sm text-rose-500">{error}</div>;
  if (!task) return <EmptyState title="Task not found" description="This task could not be loaded." />;

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
          <ArrowLeft className="h-4 w-4" />
          Back to tasks
        </Link>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-bold">{task.title}</h1>
              <StatusBadge tone={task.status}>{task.status}</StatusBadge>
              <StatusBadge tone={task.priority}>{task.priority}</StatusBadge>
            </div>
            <p className="mt-4 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              {task.description || "No task description provided."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canUpdateStatus ? (
              <>
                <button className="button-secondary" disabled={submitting} onClick={() => handleStatusUpdate("in-progress")}>
                  Mark In Progress
                </button>
                <button className="button-primary" disabled={submitting} onClick={() => handleStatusUpdate("done")}>
                  Mark Completed
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetaCard icon={ClipboardList} label="Project" value={task.project?.name || "No project"} />
        <MetaCard icon={UserCircle2} label="Assignee" value={task.assignee?.name || "Unassigned"} />
        <MetaCard icon={CheckCircle2} label="Reporter" value={task.reporter?.name || "Unknown"} />
        <MetaCard icon={CalendarDays} label="Due Date" value={formatDate(task.dueDate)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <div className="panel p-6">
          <h2 className="font-display text-2xl font-bold">People</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Assignee</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={task.assignee?.name} />
                <div>
                  <p className="font-semibold">{task.assignee?.name || "Unassigned"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.assignee?.role || "No role"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Reporter</p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={task.reporter?.name} />
                <div>
                  <p className="font-semibold">{task.reporter?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.reporter?.role || "No role"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            <h2 className="font-display text-2xl font-bold">Comments</h2>
          </div>
          <div className="mt-6 space-y-4">
            {(task.comments || []).length ? (
              task.comments.map((item) => (
                <div key={item._id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.author?.name} className="h-9 w-9 rounded-xl text-[10px]" />
                    <div>
                      <p className="font-semibold">{item.author?.name || "Team member"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.message}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No comments yet" description="Start the conversation on this task." />
            )}
          </div>
          <div className="mt-6 space-y-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <textarea
              className="input min-h-28"
              placeholder="Add an update or note"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button className="button-primary" disabled={submitting} onClick={handleComment}>
              Add comment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
