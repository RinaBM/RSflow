import type { Prisma, Trade as PrismaTrade } from "@prisma/client";
import type { CreateTradeInput, TradeListQuery, UpdateTradeInput } from "@rs-flow/shared";
import type { Paginated } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";
import { computeTradePnl } from "./pnl.js";

const SORTABLE_FIELDS = new Set(["entryTime", "symbol", "netPnl", "grossPnl", "returnPct", "createdAt"]);
const DEFAULT_SORT_FIELD = "entryTime";

function serialize(trade: PrismaTrade) {
  return {
    id: trade.id,
    userId: trade.userId,
    tradingAccountId: trade.tradingAccountId,
    symbol: trade.symbol,
    side: trade.side,
    entryTime: trade.entryTime.toISOString(),
    exitTime: trade.exitTime ? trade.exitTime.toISOString() : null,
    entryPrice: Number(trade.entryPrice),
    exitPrice: trade.exitPrice != null ? Number(trade.exitPrice) : null,
    quantity: Number(trade.quantity),
    fees: Number(trade.fees),
    grossPnl: trade.grossPnl != null ? Number(trade.grossPnl) : null,
    netPnl: trade.netPnl != null ? Number(trade.netPnl) : null,
    returnPct: trade.returnPct != null ? Number(trade.returnPct) : null,
    status: trade.status,
    notes: trade.notes,
    mistakesNotes: trade.mistakesNotes,
    tradingPlan: trade.tradingPlan,
    followedPlan: trade.followedPlan,
    emotionalState: trade.emotionalState,
    source: trade.source,
    createdAt: trade.createdAt.toISOString(),
    updatedAt: trade.updatedAt.toISOString(),
  };
}

async function assertOwnsTradingAccount(userId: string, tradingAccountId: string) {
  const account = await prisma.tradingAccount.findFirst({
    where: { id: tradingAccountId, userId },
    select: { id: true },
  });
  if (!account) {
    throw AppError.badRequest("Trading account not found");
  }
}

async function findOwnedTradeOrThrow(userId: string, id: string) {
  const trade = await prisma.trade.findFirst({ where: { id, userId } });
  if (!trade) {
    throw AppError.notFound("Trade not found");
  }
  return trade;
}

export async function listTrades(userId: string, query: TradeListQuery): Promise<Paginated<ReturnType<typeof serialize>>> {
  const where: Prisma.TradeWhereInput = {
    userId,
    ...(query.tradingAccountId ? { tradingAccountId: query.tradingAccountId } : {}),
    ...(query.symbol ? { symbol: { contains: query.symbol.toUpperCase() } } : {}),
    ...(query.side ? { side: query.side } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.dateFrom || query.dateTo
      ? {
          entryTime: {
            ...(query.dateFrom ? { gte: query.dateFrom } : {}),
            ...(query.dateTo ? { lte: query.dateTo } : {}),
          },
        }
      : {}),
  };

  const sortField = query.sort && SORTABLE_FIELDS.has(query.sort) ? query.sort : DEFAULT_SORT_FIELD;

  const [total, trades] = await Promise.all([
    prisma.trade.count({ where }),
    prisma.trade.findMany({
      where,
      orderBy: { [sortField]: query.order },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
  ]);

  return {
    items: trades.map(serialize),
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function createTrade(userId: string, input: CreateTradeInput) {
  await assertOwnsTradingAccount(userId, input.tradingAccountId);

  const pnl = computeTradePnl({
    side: input.side,
    entryPrice: input.entryPrice,
    exitPrice: input.exitPrice,
    quantity: input.quantity,
    fees: input.fees,
  });

  const trade = await prisma.trade.create({
    data: {
      userId,
      tradingAccountId: input.tradingAccountId,
      symbol: input.symbol,
      side: input.side,
      entryTime: input.entryTime,
      exitTime: input.exitTime,
      entryPrice: input.entryPrice,
      exitPrice: input.exitPrice,
      quantity: input.quantity,
      fees: input.fees,
      grossPnl: pnl.grossPnl,
      netPnl: pnl.netPnl,
      returnPct: pnl.returnPct,
      status: input.exitPrice != null ? "CLOSED" : "OPEN",
      notes: input.notes,
      mistakesNotes: input.mistakesNotes,
      tradingPlan: input.tradingPlan,
      followedPlan: input.followedPlan,
      emotionalState: input.emotionalState,
      source: "MANUAL",
    },
  });

  return serialize(trade);
}

export async function updateTrade(userId: string, id: string, input: UpdateTradeInput) {
  const existing = await findOwnedTradeOrThrow(userId, id);

  if (input.tradingAccountId) {
    await assertOwnsTradingAccount(userId, input.tradingAccountId);
  }

  const side = input.side ?? existing.side;
  const entryPrice = input.entryPrice ?? Number(existing.entryPrice);
  const quantity = input.quantity ?? Number(existing.quantity);
  const fees = input.fees ?? Number(existing.fees);
  const exitPrice = input.exitPrice !== undefined ? input.exitPrice : Number(existing.exitPrice ?? NaN);
  const resolvedExitPrice = Number.isNaN(exitPrice) ? null : exitPrice;

  const pnl = computeTradePnl({ side, entryPrice, exitPrice: resolvedExitPrice, quantity, fees });

  const trade = await prisma.trade.update({
    where: { id },
    data: {
      ...(input.tradingAccountId ? { tradingAccountId: input.tradingAccountId } : {}),
      ...(input.symbol ? { symbol: input.symbol } : {}),
      ...(input.side ? { side: input.side } : {}),
      ...(input.entryTime ? { entryTime: input.entryTime } : {}),
      ...(input.exitTime !== undefined ? { exitTime: input.exitTime } : {}),
      ...(input.entryPrice !== undefined ? { entryPrice: input.entryPrice } : {}),
      ...(input.exitPrice !== undefined ? { exitPrice: input.exitPrice } : {}),
      ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
      ...(input.fees !== undefined ? { fees: input.fees } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.mistakesNotes !== undefined ? { mistakesNotes: input.mistakesNotes } : {}),
      ...(input.tradingPlan !== undefined ? { tradingPlan: input.tradingPlan } : {}),
      ...(input.followedPlan !== undefined ? { followedPlan: input.followedPlan } : {}),
      ...(input.emotionalState !== undefined ? { emotionalState: input.emotionalState } : {}),
      grossPnl: pnl.grossPnl,
      netPnl: pnl.netPnl,
      returnPct: pnl.returnPct,
      status: resolvedExitPrice != null ? "CLOSED" : "OPEN",
    },
  });

  return serialize(trade);
}

export async function deleteTrade(userId: string, id: string) {
  await findOwnedTradeOrThrow(userId, id);
  await prisma.trade.delete({ where: { id } });
}
