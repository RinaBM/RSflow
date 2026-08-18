import { Router } from "express";
import { analyticsFilterQuerySchema, calendarQuerySchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateQuery } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { breakdowns, calendar, dashboard } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get("/dashboard", validateQuery(analyticsFilterQuerySchema), asyncHandler(dashboard));
analyticsRouter.get("/breakdowns", validateQuery(analyticsFilterQuerySchema), asyncHandler(breakdowns));
analyticsRouter.get("/calendar", validateQuery(calendarQuerySchema), asyncHandler(calendar));
