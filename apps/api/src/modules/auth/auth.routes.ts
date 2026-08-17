import { Router } from "express";
import { loginSchema, registerSchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody } from "../../common/validate.js";
import { login, logout, me, refresh, register } from "./auth.controller.js";
import { requireAuth } from "./auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), asyncHandler(register));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(login));
authRouter.post("/logout", asyncHandler(logout));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.get("/me", requireAuth, asyncHandler(me));
