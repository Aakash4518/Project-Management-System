import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { FormField } from "../../components/forms/FormField";

export default function SignupPage() {
  const { signup } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup(form);
      pushToast({ title: "Account created", description: "You're ready to start collaborating." });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel mx-auto w-full max-w-xl p-8 sm:p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Get Started</p>
      <h2 className="mt-3 font-display text-4xl font-bold">Create your project workspace.</h2>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <FormField label="Full name">
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Work email">
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Password">
          <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        <FormField label="Role">
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </FormField>
        {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p> : null}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Already have an account? <Link to="/login" className="text-emerald-600 dark:text-emerald-300">Sign in</Link>
      </p>
    </div>
  );
}
