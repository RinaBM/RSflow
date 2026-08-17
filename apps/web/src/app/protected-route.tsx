import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/features/auth/hooks";

export function ProtectedRoute() {
  const { data, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
