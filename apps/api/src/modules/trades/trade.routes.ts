import { Router } from "express";
import { createAttachmentSchema, createTradeSchema, tradeListQuerySchema, updateTradeSchema } from "@rs-flow/shared";
import { asyncHandler } from "../../common/async-handler.js";
import { validateBody, validateQuery } from "../../common/validate.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { create, getOne, list, remove, update } from "./trade.controller.js";
import {
  create as createAttachmentHandler,
  list as listAttachmentsHandler,
  remove as removeAttachmentHandler,
} from "./trade-attachment.controller.js";

export const tradeRouter = Router();

tradeRouter.use(requireAuth);

tradeRouter.get("/", validateQuery(tradeListQuerySchema), asyncHandler(list));
tradeRouter.post("/", validateBody(createTradeSchema), asyncHandler(create));
tradeRouter.get("/:id", asyncHandler(getOne));
tradeRouter.patch("/:id", validateBody(updateTradeSchema), asyncHandler(update));
tradeRouter.delete("/:id", asyncHandler(remove));

tradeRouter.get("/:tradeId/attachments", asyncHandler(listAttachmentsHandler));
tradeRouter.post(
  "/:tradeId/attachments",
  validateBody(createAttachmentSchema),
  asyncHandler(createAttachmentHandler),
);
tradeRouter.delete("/:tradeId/attachments/:attachmentId", asyncHandler(removeAttachmentHandler));
