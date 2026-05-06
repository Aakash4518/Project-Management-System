import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { EmptyState } from "../../components/common/EmptyState";
import { KanbanBoard } from "../../components/kanban/KanbanBoard";
import { FormField } from "../../components/forms/FormField";
import { useFetch } from "../../hooks/useFetch";
import { priorities, taskStatuses } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  _id: "",
  title: "",
  description: "",
  project: "",
  assignee: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export default function TasksPage() {
  const tasksQuery = useFetch("/tasks", []);
  const projectsQuery = useFetch("/projects?page=1&limit=50", []);
  const usersQuery = useFetch("/users/directory", []);
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [commentDrafts, setCommentDrafts] = useState({});
  const canManage = ["admin", "manager"].includes(user?.role);

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.emit("join:user", user.id);
    socket.on("task:assigned", (payload) => {
      pushToast({ title: payload.title, description: payload.taskTitle });
    });
    return () => socket.disconnect();
  }, [pushToast, user]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        project: form.project,
        assignee: form.assignee,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate,
      };
      const response = form._id
        ? await api.put(`/tasks/${form._id}`, payload)
        : await api.post("/tasks", payload);
      tasksQuery.setData((prev) => ({
        ...prev,
        items: form._id
          ? prev.items.map((item) => (item._id === form._id ? response.data.data.task : item))
          : [response.data.data.task, ...(prev?.items || [])],
      }));
      setForm(initialForm);
      pushToast({ title: form._id ? "Task updated" : "Task created", description: "The task board is up to date." });
    } catch (err) {
      pushToast({ title: "Task creation failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      tasksQuery.setData((prev) => ({ ...prev, items: prev.items.filter((item) => item._id !== id) }));
      pushToast({ title: "Task deleted", description: "The task has been removed." });
    } catch (err) {
      pushToast({ title: "Delete failed", description: err.response?.data?.message, tone: "error" });
    }
  };

  const handleComment = async (taskId) => {
    const message = commentDrafts[taskId];
    if (!message?.trim()) return;
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { message });
      tasksQuery.setData((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item._id === taskId ? response.data.data.task : item)),
      }));
      setCommentDrafts((prev) => ({ ...prev, [taskId]: "" }));
      pushToast({ title: "Comment added", description: "Team context has been updated." });
    } catch (err) {
      pushToast({ title: "Comment failed", description: err.response?.data?.message, tone: "error" });
    }
  };

  const handleMove = async ({ destination, draggableId }) => {
    if (!destination) return;
    const nextStatus = destination.droppableId;
    const previous = tasksQuery.data?.items || [];
    tasksQuery.setData((prev) => ({
      ...prev,
      items: prev.items.map((task) => (task._id === draggableId ? { ...task, status: nextStatus } : task)),
    }));

    try {
      await api.put(`/tasks/${draggableId}`, { status: nextStatus });
      pushToast({ title: "Task updated", description: `Moved to ${nextStatus}.` });
    } catch (err) {
      tasksQuery.setData((prev) => ({ ...prev, items: previous }));
      pushToast({ title: "Update failed", description: err.response?.data?.message, tone: "error" });
    }
  };

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Tasks</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Move work forward without losing context.</h1>
      </section>
      {canManage ? (
        <section className="panel p-6">
          <h2 className="font-display text-2xl font-bold">{form._id ? "Edit Task" : "Create Task"}</h2>
          <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleCreate}>
            <FormField label="Task title">
              <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </FormField>
            <FormField label="Project">
              <select className="input" required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
                <option value="">Select project</option>
                {(projectsQuery.data?.items || []).map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
              </select>
            </FormField>
            <FormField label="Assignee">
              <select className="input" required value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
                <option value="">Select user</option>
                {(usersQuery.data?.items || []).map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {taskStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </FormField>
            <FormField label="Priority">
              <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {priorities.map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </FormField>
            <FormField label="Due date">
              <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </FormField>
            <div className="md:col-span-2 xl:col-span-3">
              <FormField label="Description">
                <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FormField>
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <div className="flex gap-3">
                <button className="button-primary" disabled={submitting}>{submitting ? "Saving..." : form._id ? "Update task" : "Create task"}</button>
                {form._id ? (
                  <button type="button" className="button-secondary" onClick={() => setForm(initialForm)}>
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        </section>
      ) : null}
      {tasksQuery.loading ? (
        <div className="grid gap-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => <div key={index} className="panel h-80 animate-pulse" />)}
        </div>
      ) : tasksQuery.error ? (
        <div className="panel p-8 text-sm text-rose-500">{tasksQuery.error}</div>
      ) : (tasksQuery.data?.items || []).length === 0 ? (
        <EmptyState title="No tasks yet" description="Create a task to populate the Kanban board." />
      ) : (
        <div className="space-y-4">
          <KanbanBoard tasks={tasksQuery.data.items} onMove={handleMove} />
          <section className="grid gap-4 xl:grid-cols-2">
            {tasksQuery.data.items.slice(0, 4).map((task) => (
              <article key={task._id} className="panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/tasks/${task._id}`} className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-300">
                      {task.title}
                    </Link>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{task.description || "No description provided."}</p>
                  </div>
                  {canManage ? (
                    <div className="flex gap-2">
                      <button
                        className="button-secondary"
                        onClick={() =>
                          setForm({
                            _id: task._id,
                            title: task.title,
                            description: task.description || "",
                            project: task.project?._id || task.project,
                            assignee: task.assignee?._id || task.assignee,
                            status: task.status,
                            priority: task.priority,
                            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
                          })
                        }
                      >
                        Edit
                      </button>
                      <button className="button-secondary" onClick={() => handleDelete(task._id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="mt-4 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Comments</p>
                  <div className="mt-3 space-y-3">
                    {(task.comments || []).slice(-2).map((comment) => (
                      <div key={comment._id} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
                        {comment.message}
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <input
                        className="input"
                        placeholder="Add a comment"
                        value={commentDrafts[task._id] || ""}
                        onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [task._id]: e.target.value }))}
                      />
                      <button className="button-primary" onClick={() => handleComment(task._id)}>
                        Send
                      </button>
                    </div>
                    <div>
                      <Link to={`/tasks/${task._id}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                        Open full task
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
