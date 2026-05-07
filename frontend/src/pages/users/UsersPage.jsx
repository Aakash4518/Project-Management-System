import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import api from "../../api/client";
import { Avatar } from "../../components/common/Avatar";
import { EmptyState } from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/StatusBadge";
import { FormField } from "../../components/forms/FormField";
import { useFetch } from "../../hooks/useFetch";
import { roles } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
  title: "",
  isActive: true,
};

export default function UsersPage() {
  const { user } = useAuth();
  const { data, loading, error, setData } = useFetch(user?.role === "admin" ? "/users" : null, [user?.role]);
  const { pushToast } = useToast();
  const [savingId, setSavingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  if (user?.role !== "admin") {
    return <div className="panel p-8 text-sm text-slate-500 dark:text-slate-400">Only admins can manage users and role assignments.</div>;
  }

  const handleRoleChange = async (userId, role) => {
    setSavingId(userId);
    try {
      const response = await api.patch(`/users/${userId}`, { role });
      setData((prev) => ({
        ...prev,
        items: prev.items.map((item) => (item._id === userId ? response.data.data.user : item)),
      }));
      pushToast({ title: "User updated", description: "Role change has been applied." });
    } catch (err) {
      pushToast({ title: "Update failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setSavingId("");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      const response = await api.post("/users", form);
      setData((prev) => ({
        ...prev,
        items: [response.data.data.user, ...(prev?.items || [])],
      }));
      setForm(initialForm);
      pushToast({ title: "User created", description: "The account is ready to use." });
    } catch (err) {
      pushToast({ title: "User creation failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (member) => {
    if (member._id === user?.id) return;
    const confirmed = window.confirm(`Delete ${member.name}? Their project ownership will transfer to you.`);
    if (!confirmed) return;

    setDeletingId(member._id);
    try {
      await api.delete(`/users/${member._id}`);
      setData((prev) => ({
        ...prev,
        items: (prev?.items || []).filter((item) => item._id !== member._id),
      }));
      pushToast({ title: "User deleted", description: "The account has been removed." });
    } catch (err) {
      pushToast({ title: "Delete failed", description: err.response?.data?.message, tone: "error" });
    } finally {
      setDeletingId("");
    }
  };

  if (loading) return <div className="panel h-80 animate-pulse" />;
  if (error) return <div className="panel p-8 text-sm text-rose-500">{error}</div>;

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Administration</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Manage people, access, and account status.</h1>
      </section>
      <section className="panel p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <UserPlus className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold">Add User</h2>
        </div>
        <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleCreate}>
          <FormField label="Name">
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Password">
            <input className="input" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </FormField>
          <FormField label="Role">
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </FormField>
          <FormField label="Title">
            <input className="input" placeholder="Team Member" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <select className="input" value={form.isActive ? "active" : "inactive"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </FormField>
          <div className="md:col-span-2 xl:col-span-3">
            <button className="button-primary" disabled={creating}>{creating ? "Creating..." : "Create user"}</button>
          </div>
        </form>
      </section>
      {!data?.items?.length ? (
        <EmptyState title="No team members found" description="Add users to start managing roles." />
      ) : null}
      <section className="panel overflow-hidden">
        <div className="grid gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:text-slate-400 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.4fr]">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>
        {(data?.items || []).map((member) => (
          <div key={member._id} className="grid gap-4 border-b border-slate-200 px-6 py-5 last:border-b-0 dark:border-slate-800 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_0.4fr]">
            <div className="flex items-center gap-3">
              <Avatar name={member.name} />
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
              </div>
            </div>
            <div>
              <select className="input h-11 py-0" value={member.role} onChange={(e) => handleRoleChange(member._id, e.target.value)} disabled={savingId === member._id}>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </div>
            <div className="flex items-center">
              <StatusBadge tone={member.isActive ? "done" : "critical"}>{member.isActive ? "active" : "inactive"}</StatusBadge>
            </div>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">{formatDate(member.createdAt)}</div>
            <div className="flex items-center">
              <button
                className="button-secondary h-11 w-11 px-0"
                title={member._id === user?.id ? "You cannot delete your own account" : "Delete user"}
                disabled={member._id === user?.id || deletingId === member._id}
                onClick={() => handleDelete(member)}
              >
                <Trash2 className="mx-auto h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
