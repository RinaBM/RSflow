import { Router } from "express";
import { calendarQuerySchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateQuery } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { calendar, dashboard } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get("/dashboard", asyncHandler(dashboard));
analyticsRouter.get("/calendar", validateQuery(calendarQuerySchema), asyncHandler(calendar));
