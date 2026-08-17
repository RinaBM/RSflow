import { Router } from "express";
import { createTradingAccountSchema, updateTradingAccountSchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { create, list, remove, update } from "./trading-account.controller.js";

export const tradingAccountRouter = Router();

tradingAccountRouter.use(requireAuth);

tradingAccountRouter.get("/", asyncHandler(list));
tradingAccountRouter.post("/", validateBody(createTradingAccountSchema), asyncHandler(create));
tradingAccountRouter.patch(
  "/:id",
  validateBody(updateTradingAccountSchema),
  asyncHandler(update),
);
tradingAccountRouter.delete("/:id", asyncHandler(remove));
