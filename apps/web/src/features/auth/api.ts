import type { AuthUser, LoginInput, RegisterInput } from "@rs-flow/shared";
import { api } from "@/lib/api-client";

export const authApi = {
  me: () => api.get<{ user: AuthUser }>("/auth/me"),
  login: (input: LoginInput) => api.post<{ user: AuthUser }>("/auth/login", input),
  register: (input: RegisterInput) => api.post<{ user: AuthUser }>("/auth/register", input),
  logout: () => api.post<void>("/auth/logout"),
};
