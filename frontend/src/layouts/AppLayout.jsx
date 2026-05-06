import { Bell, FolderKanban, LayoutDashboard, LogOut, Moon, Sun, Users2 } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Avatar } from "../components/common/Avatar";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: Bell },
  { to: "/users", label: "Users", icon: Users2, adminOnly: true },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="panel flex flex-col justify-between p-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 font-display text-lg font-bold text-white">
                TF
              </div>
              <div>
                <p className="font-display text-lg font-bold">TaskFlow Pro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Delivery command center</p>
              </div>
            </div>
            <nav className="mt-10 space-y-2">
              {navigation
                .filter((item) => !item.adminOnly || user?.role === "admin")
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                          isActive
                            ? "bg-slate-900 text-white dark:bg-emerald-500"
                            : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  );
                })}
            </nav>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-900 p-4 text-white dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name} />
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{user?.role}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="button-secondary flex-1" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Theme
              </button>
              <button
                className="button-secondary flex-1"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>
        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
