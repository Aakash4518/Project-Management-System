import dayjs from "dayjs";

export const TimelineCard = ({ items = [] }) => (
  <div className="panel p-6">
    <div className="flex items-center justify-between">
      <h3 className="font-display text-xl font-bold">Activity Feed</h3>
      <span className="text-xs text-slate-500 dark:text-slate-400">Latest changes</span>
    </div>
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <div key={item._id} className="flex gap-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
          <div>
            <p className="text-sm font-semibold">{item.message}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {item.actor?.name} • {dayjs(item.createdAt).format("DD MMM, hh:mm A")}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
