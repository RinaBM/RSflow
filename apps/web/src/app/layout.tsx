import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
  Sprout,
  Upload,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout, useMe } from "@/features/auth/hooks";
import { LanguageToggle } from "@/components/ui/language-toggle";

const NAV_GROUPS = [
  {
    groupKey: "trading" as const,
    items: [
      { to: "/", key: "dashboard" as const, icon: LayoutDashboard, end: true },
      { to: "/journal", key: "journal" as const, icon: BookOpen, end: false },
      { to: "/calendar", key: "calendar" as const, icon: CalendarDays, end: false },
      { to: "/analytics", key: "analytics" as const, icon: BarChart3, end: false },
      { to: "/strategies", key: "strategies" as const, icon: Layers, end: false },
      { to: "/growth", key: "growth" as const, icon: Sprout, end: false },
    ],
  },
  {
    groupKey: "data" as const,
    items: [
      { to: "/import", key: "import" as const, icon: Upload, end: false },
      { to: "/trading-accounts", key: "tradingAccounts" as const, icon: Wallet, end: false },
    ],
  },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "flex items-center gap-3 rounded-md border-s-2 px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "border-primary bg-accent text-foreground"
      : "border-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function AppLayout() {
  const { data } = useMe();
  const logout = useLogout();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-60 shrink-0 flex-col border-e border-border bg-card">
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
              R
            </span>
            <span className="text-sm font-semibold tracking-wide">RS FLOW</span>
          </div>
          <LanguageToggle />
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupKey} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {t(`nav.groups.${group.groupKey}`)}
              </div>
              {group.items.map(({ to, key, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={navLinkClass}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {t(`nav.items.${key}`)}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border px-3 py-3">
          <NavLink to="/settings" className={navLinkClass}>
            <Settings className="h-4 w-4 shrink-0" />
            {t("nav.items.settings")}
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <User className="h-4 w-4 shrink-0" />
            {t("nav.items.profile")}
          </NavLink>
          <button
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-3 rounded-md border-s-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t("nav.items.logout")}
          </button>
        </div>

        {data?.user ? (
          <div className="flex items-center gap-2.5 border-t border-border px-4 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
              {initials(data.user.name)}
            </span>
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-foreground">{data.user.name}</div>
              <div className="truncate text-[11px] text-muted-foreground" dir="ltr">
                {data.user.email}
              </div>
            </div>
          </div>
        ) : null}
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
