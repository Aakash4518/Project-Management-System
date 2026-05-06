export const FullScreenLoader = ({ label }) => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="panel w-full max-w-sm p-8 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);
