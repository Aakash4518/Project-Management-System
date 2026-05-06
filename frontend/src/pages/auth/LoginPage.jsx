import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { FormField } from "../../components/forms/FormField";

export default function LoginPage() {
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      pushToast({ title: "Welcome back", description: "Your workspace is ready." });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel mx-auto w-full max-w-xl p-8 sm:p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">Welcome Back</p>
      <h2 className="mt-3 font-display text-4xl font-bold">Sign in to continue shipping.</h2>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <FormField label="Work email">
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Password">
          <input className="input" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p> : null}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="text-emerald-600 dark:text-emerald-300">Forgot password?</Link>
        <Link to="/signup" className="text-slate-500 dark:text-slate-400">Create account</Link>
      </div>
    </div>
  );
}
