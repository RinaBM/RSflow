import { useState, type FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLogin, useMe } from "@/features/auth/hooks";
import { ApiError } from "@/lib/api-client";

export function LoginPage() {
  const { t } = useTranslation();
  const { data, isLoading: meLoading } = useMe();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!meLoading && data?.user) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.loginTitle")}</CardTitle>
          <CardDescription>{t("auth.loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {login.isError ? (
              <p className="text-sm text-destructive">
                {login.error instanceof ApiError ? login.error.message : t("auth.loginFailed")}
              </p>
            ) : null}

            <Button type="submit" disabled={login.isPending}>
              {login.isPending ? t("auth.signingIn") : t("auth.signIn")}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-primary hover:underline">
              {t("auth.registerLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
