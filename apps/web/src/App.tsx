import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/query-client";
import { AppLayout } from "@/app/layout";
import { ProtectedRoute } from "@/app/protected-route";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { JournalPage } from "@/pages/journal-page";
import { CalendarPage } from "@/pages/calendar-page";
import { AnalyticsPage } from "@/pages/analytics-page";
import { StrategiesPage } from "@/pages/strategies-page";
import { ImportPage } from "@/pages/import-page";
import { TradingAccountsPage } from "@/pages/trading-accounts-page";
import { SettingsPage } from "@/pages/settings-page";
import { ProfilePage } from "@/pages/profile-page";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/strategies" element={<StrategiesPage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/trading-accounts" element={<TradingAccountsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
