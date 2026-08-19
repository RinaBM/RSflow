import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Settings,
  Sprout,
  Upload,
  User,
  Wallet,
  X,
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
    "flex items-center gap-3 rounded-md border-s-2 px-3 py-2 text-sm transition-colors",
    isActive
      ? "border-primary bg-accent font-bold text-foreground"
      : "border-transparent font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground",
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
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
            R
          </span>
          <span className="text-sm font-semibold tracking-wide">RS FLOW</span>
        </div>
        <LanguageToggle />
      </div>

      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 shrink-0 flex-col border-e border-border bg-card transition-transform duration-200 lg:static lg:w-60",
          // Scoped to max-lg so these transforms don't exist as rules at lg:+ at all --
          // avoids relying on lg: overriding rtl: in the cascade, which isn't guaranteed.
          mobileNavOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full max-lg:rtl:translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-xs font-bold text-primary-foreground">
              R
            </span>
            <span className="text-sm font-semibold tracking-wide">RS FLOW</span>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
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

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 pt-20 sm:p-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
