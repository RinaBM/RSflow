import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
  Upload,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout, useMe } from "@/features/auth/hooks";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/strategies", label: "Strategies", icon: Layers },
  { to: "/import", label: "Import", icon: Upload },
  { to: "/trading-accounts", label: "Trading Accounts", icon: Wallet },
];

export function AppLayout() {
  const { data } = useMe();
  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center px-5">
          <span className="text-lg font-semibold tracking-tight">RS Flow</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border px-3 py-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <Settings className="h-4 w-4" />
            Settings
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <User className="h-4 w-4" />
            Profile
          </NavLink>
          <button
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {data?.user ? (
          <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            {data.user.name} · {data.user.email}
          </div>
        ) : null}
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
