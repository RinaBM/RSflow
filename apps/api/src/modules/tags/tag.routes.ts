import { Router } from "express";
import { createTagSchema, updateTagSchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { create, list, remove, update } from "./tag.controller.js";

export const tagRouter = Router();

tagRouter.use(requireAuth);

tagRouter.get("/", asyncHandler(list));
tagRouter.post("/", validateBody(createTagSchema), asyncHandler(create));
tagRouter.patch("/:id", validateBody(updateTagSchema), asyncHandler(update));
tagRouter.delete("/:id", asyncHandler(remove));
