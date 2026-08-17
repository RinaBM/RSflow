import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/app-error.js";
import { ACCESS_COOKIE } from "./auth.cookies.js";
import { verifyAccessToken } from "./auth.tokens.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    throw AppError.unauthorized("Authentication required");
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    throw AppError.unauthorized("Invalid or expired session");
  }
}
