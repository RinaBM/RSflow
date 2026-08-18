import { useState, type FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import type { Gender } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMe, useRegister } from "@/features/auth/hooks";
import { ApiError } from "@/lib/api-client";

export function RegisterPage() {
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
          <CardTitle>Create your RS Flow account</CardTitle>
          <CardDescription>Start journaling your trades in minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Gender</Label>
              <p className="text-xs text-muted-foreground">So we can address you correctly around the app.</p>
              <div className="flex overflow-hidden rounded-md border border-input">
                <button
                  type="button"
                  onClick={() => setGender("FEMALE")}
                  className={cn(
                    "flex-1 px-4 py-1.5 text-sm font-medium transition-colors",
                    gender === "FEMALE" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setGender("MALE")}
                  className={cn(
                    "flex-1 border-s border-input px-4 py-1.5 text-sm font-medium transition-colors",
                    gender === "MALE" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  Male
                </button>
              </div>
            </div>

            {register.isError ? (
              <p className="text-sm text-destructive">
                {register.error instanceof ApiError ? register.error.message : "Registration failed"}
              </p>
            ) : null}

            <Button type="submit" disabled={register.isPending || !gender}>
              {register.isPending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
