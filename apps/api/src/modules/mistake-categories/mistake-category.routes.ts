import { Router } from "express";
import { createMistakeCategorySchema, updateMistakeCategorySchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { create, list, remove, update } from "./mistake-category.controller.js";

export const mistakeCategoryRouter = Router();

mistakeCategoryRouter.use(requireAuth);

mistakeCategoryRouter.get("/", asyncHandler(list));
mistakeCategoryRouter.post("/", validateBody(createMistakeCategorySchema), asyncHandler(create));
mistakeCategoryRouter.patch("/:id", validateBody(updateMistakeCategorySchema), asyncHandler(update));
mistakeCategoryRouter.delete("/:id", asyncHandler(remove));
