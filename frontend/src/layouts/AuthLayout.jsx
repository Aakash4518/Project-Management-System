import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="relative min-h-screen overflow-hidden px-4 py-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_30%)]" />
    <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-10 text-white shadow-soft backdrop-blur lg:block">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-emerald-300">TaskFlow Pro</p>
        <h1 className="mt-6 font-display text-5xl font-bold leading-tight">
          Make delivery look calm, even when the work is not.
        </h1>
        <p className="mt-6 max-w-lg text-base text-slate-300">
          A premium project workspace built for cross-functional teams, live progress tracking, and clean handoffs.
        </p>
      </div>
      <Outlet />
    </div>
  </div>
);
