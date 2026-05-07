import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { EmptyState } from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/SkeletonCard";
import { StatusBadge } from "../../components/common/StatusBadge";
import { FormField } from "../../components/forms/FormField";
import MultiSelect from "../../components/forms/MultiSelect";
import { useFetch } from "../../hooks/useFetch";
import { formatDate } from "../../utils/helpers";
import { projectStatuses, priorities } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  _id: "",
  name: "",
  description: "",
  status: "planning",
  priority: "medium",
  dueDate: "",
  members: [],
};

export default function ProjectsPage() {
  const { data, loading, error, setData } = useFetch("/projects?page=1&limit=12", []);
  const directoryQuery = useFetch("/users/directory", []);
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const canManage = ["admin", "manager"].includes(user?.role);
  const items = useMemo(() => {
    const list = data?.items || [];
    return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate,
        members: form.members,
      };
      const response = form._id
        ? await api.put(`/projects/${form._id}`, payload)
        : await api.post("/projects", payload);
      setData((prev) => ({
        ...prev,
        items: form._id
          ? prev.items.map((item) => (item._id === form._id ? response.data.data.project : item))
          : [response.data.data.project, ...(prev?.items || [])],
      }));
      setForm(initialForm);
      pushToast({ title: form._id ? "Project updated" : "Project created", description: "Your changes have been saved." });
    } catch (err) {
      pushToast({ title: "Project creation failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setData((prev) => ({ ...prev, items: prev.items.filter((item) => item._id !== id) }));
      pushToast({ title: "Project deleted", description: "The project and related tasks were removed." });
    } catch (err) {
      pushToast({ title: "Delete failed", description: err.response?.data?.message, tone: "error" });
    }
  };

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Projects</p>
            <h1 className="mt-3 font-display text-4xl font-bold">Track every initiative in one place.</h1>
          </div>
          <label className="relative block w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input pl-11" placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
      </section>
      {canManage ? (
        <section className="panel p-6">
          <h2 className="font-display text-2xl font-bold">{form._id ? "Edit Project" : "Create Project"}</h2>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
            <FormField label="Project name">
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label="Due date">
              <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Description">
                <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Status">
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {projectStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </FormField>
            <FormField label="Priority">
              <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {priorities.map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Assign members">
                <MultiSelect
                  options={(directoryQuery.data?.items || []).map((member) => ({
                    value: member._id,
                    label: member.name,
                    subtitle: member.role,
                  }))}
                  selected={form.members}
                  onChange={(members) => setForm({ ...form, members })}
                  placeholder="Search team members"
                  emptyMessage="No users available to assign."
                />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-3">
                <button className="button-primary" disabled={submitting}>{submitting ? "Saving..." : form._id ? "Update project" : "Create project"}</button>
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
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} className="h-56" />)}
        </div>
      ) : error ? (
        <div className="panel p-8 text-sm text-rose-500">{error}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No projects found" description="Create your first initiative to start planning delivery." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((project) => (
            <article key={project._id} className="panel p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link to={`/projects/${project._id}`} className="font-display text-xl font-bold hover:text-emerald-600 dark:hover:text-emerald-300">
                    {project.name}
                  </Link>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
                </div>
                <StatusBadge tone={project.status}>{project.status}</StatusBadge>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${project.progress || 0}%` }} />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <StatusBadge tone={project.priority}>{project.priority}</StatusBadge>
                <StatusBadge>{project.taskSummary?.completed || 0}/{project.taskSummary?.total || 0} tasks done</StatusBadge>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{project.members?.length || 0} members</span>
                <span>Due {formatDate(project.dueDate)}</span>
              </div>
              <div className="mt-4">
                <Link to={`/projects/${project._id}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                  Open project
                </Link>
              </div>
              {canManage ? (
                <div className="mt-5 flex gap-3">
                  <button
                    className="button-secondary"
                    onClick={() =>
                      setForm({
                        _id: project._id,
                        name: project.name,
                        description: project.description || "",
                        status: project.status,
                        priority: project.priority,
                        dueDate: project.dueDate ? project.dueDate.slice(0, 10) : "",
                        members: (project.members || []).map((member) => member._id || member),
                      })
                    }
                  >
                    Edit
                  </button>
                  <button className="button-secondary" onClick={() => handleDelete(project._id)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
