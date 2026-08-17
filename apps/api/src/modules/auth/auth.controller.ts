import type { Request, Response } from "express";
import { AppError } from "../../common/app-error.js";
import { clearAuthCookies, REFRESH_COOKIE, setAuthCookies } from "./auth.cookies.js";
import { getUserById, loginUser, refreshSession, registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
  const { accessToken, refreshToken, user } = await registerUser(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const { accessToken, refreshToken, user } = await loginUser(req.body);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({ user });
}

export async function logout(_req: Request, res: Response) {
  clearAuthCookies(res);
  res.status(204).send();
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    throw AppError.unauthorized("Missing refresh token");
  }

  const { accessToken, refreshToken, user } = await refreshSession(token);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({ user });
}

export async function me(req: Request, res: Response) {
  const user = await getUserById(req.userId as string);
  res.status(200).json({ user });
}
