import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { FormField } from "../../components/forms/FormField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel mx-auto w-full max-w-xl p-8 sm:p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Password Reset</p>
      <h2 className="mt-3 font-display text-4xl font-bold">We’ll help you back in.</h2>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <FormField label="Email address">
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        {message ? <p className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</p> : null}
        <button className="button-primary w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="text-emerald-600 dark:text-emerald-300">Back to login</Link>
      </p>
    </div>
  );
}
