import { useState, type FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Gender } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMe, useRegister } from "@/features/auth/hooks";
import { ApiError } from "@/lib/api-client";

export function RegisterPage() {
  const { t } = useTranslation();
  const { data, isLoading: meLoading } = useMe();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender | "">("");

  if (!meLoading && data?.user) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!gender) return;
    register.mutate({ name, email, password, gender });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.registerTitle")}</CardTitle>
          <CardDescription>{t("auth.registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
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
                minLength={8}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("auth.genderLabel")}</Label>
              <p className="text-xs text-muted-foreground">{t("auth.genderHint")}</p>
              <div className="flex overflow-hidden rounded-md border border-input">
                <button
                  type="button"
                  onClick={() => setGender("FEMALE")}
                  className={cn(
                    "flex-1 px-4 py-1.5 text-sm font-medium transition-colors",
                    gender === "FEMALE" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("auth.female")}
                </button>
                <button
                  type="button"
                  onClick={() => setGender("MALE")}
                  className={cn(
                    "flex-1 border-s border-input px-4 py-1.5 text-sm font-medium transition-colors",
                    gender === "MALE" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t("auth.male")}
                </button>
              </div>
            </div>

            {register.isError ? (
              <p className="text-sm text-destructive">
                {register.error instanceof ApiError ? register.error.message : t("auth.registerFailed")}
              </p>
            ) : null}

            <Button type="submit" disabled={register.isPending || !gender}>
              {register.isPending ? t("auth.creatingAccount") : t("auth.createAccount")}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {t("auth.signInLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
