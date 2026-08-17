import { Router } from "express";
import { createSetupSchema, updateSetupSchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { create, list, remove, update } from "./setup.controller.js";

export const setupRouter = Router();

setupRouter.use(requireAuth);

setupRouter.get("/", asyncHandler(list));
setupRouter.post("/", validateBody(createSetupSchema), asyncHandler(create));
setupRouter.patch("/:id", validateBody(updateSetupSchema), asyncHandler(update));
setupRouter.delete("/:id", asyncHandler(remove));
