import { Router } from "express";
import { asyncHandler } from "../../common/async-handler.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { dashboard } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get("/dashboard", asyncHandler(dashboard));
