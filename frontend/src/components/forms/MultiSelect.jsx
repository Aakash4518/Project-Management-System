import { useMemo, useState } from "react";
import { Search, CheckCircle2, X } from "lucide-react";

export default function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Search...",
  emptyMessage = "No options available.",
  selectAllLabel = "Select all",
  clearAllLabel = "Clear all",
}) {
  const [query, setQuery] = useState("");

  if (!Array.isArray(options)) {
    console.error("MultiSelect: options must be an array", options);
    return <div className="text-red-500">Error: Invalid options provided</div>;
  }

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => {
      if (!option.label) return false;
      return option.label.toLowerCase().includes(normalized);
    });
  }, [options, query]);

  const selectedItems = useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [options, selected]
  );

  const toggleOption = (value) => {
    if (!onChange) return;
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value]);
  };

  const selectAll = () => {
    if (!onChange) return;
    const all = filteredOptions.map((option) => option.value).filter(Boolean);
    onChange(Array.from(new Set([...selected, ...all])));
  };

  const clearAll = () => {
    if (!onChange) return;
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-11"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="button-secondary" onClick={selectAll}>
            {selectAllLabel}
          </button>
          <button type="button" className="button-secondary" onClick={clearAll}>
            {clearAllLabel}
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
        {selectedItems.length ? (
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <div key={item.value} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <span>{item.label}</span>
                <button type="button" onClick={() => toggleOption(item.value)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No members selected.</p>
        )}

        <div className="space-y-2">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-800 ${selected.includes(option.value) ? "border-emerald-500 bg-emerald-50 dark:bg-slate-800" : "border-transparent bg-transparent"}`}
                onClick={() => toggleOption(option.value)}
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{option.label}</p>
                  {option.subtitle ? <p className="text-sm text-slate-500 dark:text-slate-400">{option.subtitle}</p> : null}
                </div>
                {selected.includes(option.value) ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : null}
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
