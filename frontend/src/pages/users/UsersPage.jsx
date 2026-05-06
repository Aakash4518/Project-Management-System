import { useState } from "react";
import api from "../../api/client";
import { Avatar } from "../../components/common/Avatar";
import { EmptyState } from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useFetch } from "../../hooks/useFetch";
import { roles } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

export default function UsersPage() {
  const { user } = useAuth();
  const { data, loading, error, setData } = useFetch(user?.role === "admin" ? "/users" : null, [user?.role]);
  const { pushToast } = useToast();
  const [savingId, setSavingId] = useState("");

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

  if (loading) return <div className="panel h-80 animate-pulse" />;
  if (error) return <div className="panel p-8 text-sm text-rose-500">{error}</div>;
  if (!data?.items?.length) return <EmptyState title="No team members found" description="Add users to start managing roles." />;

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Administration</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Manage people, access, and account status.</h1>
      </section>
      <section className="panel overflow-hidden">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
        </div>
        {data.items.map((member) => (
          <div key={member._id} className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-slate-200 px-6 py-5 last:border-b-0 dark:border-slate-800">
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
          </div>
        ))}
      </section>
    </div>
  );
}
