import { Router } from "express";
import { createStrategySchema, updateStrategySchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { create, list, remove, update } from "./strategy.controller.js";

export const strategyRouter = Router();

strategyRouter.use(requireAuth);

strategyRouter.get("/", asyncHandler(list));
strategyRouter.post("/", validateBody(createStrategySchema), asyncHandler(create));
strategyRouter.patch("/:id", validateBody(updateStrategySchema), asyncHandler(update));
strategyRouter.delete("/:id", asyncHandler(remove));
