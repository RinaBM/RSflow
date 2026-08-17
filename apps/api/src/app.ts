import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./common/error-handler.js";
import { logger } from "./common/logger.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { tradingAccountRouter } from "./modules/trading-accounts/trading-account.routes.js";
import { tradeRouter } from "./modules/trades/trade.routes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/api/auth", authRouter);
  app.use("/api/trading-accounts", tradingAccountRouter);
  app.use("/api/trades", tradeRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
