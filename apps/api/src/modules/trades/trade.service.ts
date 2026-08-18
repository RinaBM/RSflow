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
    strategyId: trade.strategyId,
    setupId: trade.setupId,
    entryReason: trade.entryReason,
    notes: trade.notes,
    mistakesNotes: trade.mistakesNotes,
    whatWentWell: trade.whatWentWell,
    lessonsLearned: trade.lessonsLearned,
    tradingPlan: trade.tradingPlan,
    followedPlan: trade.followedPlan,
    emotionalState: trade.emotionalState,
    source: trade.source,
    createdAt: trade.createdAt.toISOString(),
    updatedAt: trade.updatedAt.toISOString(),
  };
}

function serializeDetail(
  trade: PrismaTrade & {
    strategy: { id: string; userId: string; name: string; description: string | null; createdAt: Date } | null;
    setup: { id: string; userId: string; name: string; description: string | null; createdAt: Date } | null;
    tags: { tag: { id: string; userId: string; name: string; color: string | null; createdAt: Date } }[];
    mistakes: { mistakeCategory: { id: string; userId: string; name: string; createdAt: Date } }[];
    attachments: { id: string; tradeId: string; url: string; type: string; caption: string | null; createdAt: Date }[];
  },
) {
  return {
    ...serialize(trade),
    strategy: trade.strategy
      ? { ...trade.strategy, createdAt: trade.strategy.createdAt.toISOString() }
      : null,
    setup: trade.setup ? { ...trade.setup, createdAt: trade.setup.createdAt.toISOString() } : null,
    tags: trade.tags.map((t) => ({ ...t.tag, createdAt: t.tag.createdAt.toISOString() })),
    mistakeCategories: trade.mistakes.map((m) => ({
      ...m.mistakeCategory,
      createdAt: m.mistakeCategory.createdAt.toISOString(),
    })),
    attachments: trade.attachments.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
  };
}

const detailInclude = {
  strategy: true,
  setup: true,
  tags: { include: { tag: true } },
  mistakes: { include: { mistakeCategory: true } },
  attachments: true,
} satisfies Prisma.TradeInclude;

async function assertOwnsTradingAccount(userId: string, tradingAccountId: string) {
  const account = await prisma.tradingAccount.findFirst({
    where: { id: tradingAccountId, userId },
    select: { id: true },
  });
  if (!account) {
    throw AppError.badRequest("Trading account not found");
  }
}

async function assertOwnsStrategy(userId: string, strategyId: string) {
  const strategy = await prisma.strategy.findFirst({ where: { id: strategyId, userId }, select: { id: true } });
  if (!strategy) {
    throw AppError.badRequest("Strategy not found");
  }
}

async function assertOwnsSetup(userId: string, setupId: string) {
  const setup = await prisma.setup.findFirst({ where: { id: setupId, userId }, select: { id: true } });
  if (!setup) {
    throw AppError.badRequest("Setup not found");
  }
}

async function assertOwnsTags(userId: string, tagIds: string[]) {
  if (tagIds.length === 0) return;
  const count = await prisma.tag.count({ where: { id: { in: tagIds }, userId } });
  if (count !== new Set(tagIds).size) {
    throw AppError.badRequest("One or more tags not found");
  }
}

async function assertOwnsMistakeCategories(userId: string, mistakeCategoryIds: string[]) {
  if (mistakeCategoryIds.length === 0) return;
  const count = await prisma.mistakeCategory.count({ where: { id: { in: mistakeCategoryIds }, userId } });
  if (count !== new Set(mistakeCategoryIds).size) {
    throw AppError.badRequest("One or more mistake categories not found");
  }
}

async function findOwnedTradeOrThrow(userId: string, id: string) {
  const trade = await prisma.trade.findFirst({ where: { id, userId } });
  if (!trade) {
    throw AppError.notFound("Trade not found");
  }
  return trade;
}

async function setTradeTags(tradeId: string, tagIds: string[]) {
  await prisma.$transaction([
    prisma.tradeTag.deleteMany({ where: { tradeId } }),
    ...(tagIds.length > 0
      ? [prisma.tradeTag.createMany({ data: tagIds.map((tagId) => ({ tradeId, tagId })) })]
      : []),
  ]);
}

async function setTradeMistakes(tradeId: string, mistakeCategoryIds: string[]) {
  await prisma.$transaction([
    prisma.tradeMistake.deleteMany({ where: { tradeId } }),
    ...(mistakeCategoryIds.length > 0
      ? [
          prisma.tradeMistake.createMany({
            data: mistakeCategoryIds.map((mistakeCategoryId) => ({ tradeId, mistakeCategoryId })),
          }),
        ]
      : []),
  ]);
}

export async function listRecentSymbols(userId: string): Promise<string[]> {
  const rows = await prisma.trade.findMany({
    where: { userId },
    distinct: ["symbol"],
    orderBy: { entryTime: "desc" },
    select: { symbol: true },
    take: 20,
  });
  return rows.map((r) => r.symbol);
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
    ...(query.exitDateFrom || query.exitDateTo
      ? {
          exitTime: {
            ...(query.exitDateFrom ? { gte: query.exitDateFrom } : {}),
            ...(query.exitDateTo ? { lte: query.exitDateTo } : {}),
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

export async function getTradeById(userId: string, id: string) {
  const trade = await prisma.trade.findFirst({ where: { id, userId }, include: detailInclude });
  if (!trade) {
    throw AppError.notFound("Trade not found");
  }
  return serializeDetail(trade);
}

export async function createTrade(userId: string, input: CreateTradeInput) {
  if (input.tradingAccountId) await assertOwnsTradingAccount(userId, input.tradingAccountId);
  if (input.strategyId) await assertOwnsStrategy(userId, input.strategyId);
  if (input.setupId) await assertOwnsSetup(userId, input.setupId);
  if (input.tagIds) await assertOwnsTags(userId, input.tagIds);
  if (input.mistakeCategoryIds) await assertOwnsMistakeCategories(userId, input.mistakeCategoryIds);

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
      tradingAccountId: input.tradingAccountId ?? null,
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
      strategyId: input.strategyId,
      setupId: input.setupId,
      entryReason: input.entryReason,
      notes: input.notes,
      mistakesNotes: input.mistakesNotes,
      whatWentWell: input.whatWentWell,
      lessonsLearned: input.lessonsLearned,
      tradingPlan: input.tradingPlan,
      followedPlan: input.followedPlan,
      emotionalState: input.emotionalState,
      source: "MANUAL",
    },
  });

  if (input.tagIds) await setTradeTags(trade.id, input.tagIds);
  if (input.mistakeCategoryIds) await setTradeMistakes(trade.id, input.mistakeCategoryIds);

  return serialize(trade);
}

export async function updateTrade(userId: string, id: string, input: UpdateTradeInput) {
  const existing = await findOwnedTradeOrThrow(userId, id);

  if (input.tradingAccountId != null) {
    await assertOwnsTradingAccount(userId, input.tradingAccountId);
  }
  if (input.strategyId) await assertOwnsStrategy(userId, input.strategyId);
  if (input.setupId) await assertOwnsSetup(userId, input.setupId);
  if (input.tagIds) await assertOwnsTags(userId, input.tagIds);
  if (input.mistakeCategoryIds) await assertOwnsMistakeCategories(userId, input.mistakeCategoryIds);

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
      ...(input.tradingAccountId !== undefined ? { tradingAccountId: input.tradingAccountId } : {}),
      ...(input.symbol ? { symbol: input.symbol } : {}),
      ...(input.side ? { side: input.side } : {}),
      ...(input.entryTime ? { entryTime: input.entryTime } : {}),
      ...(input.exitTime !== undefined ? { exitTime: input.exitTime } : {}),
      ...(input.entryPrice !== undefined ? { entryPrice: input.entryPrice } : {}),
      ...(input.exitPrice !== undefined ? { exitPrice: input.exitPrice } : {}),
      ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
      ...(input.fees !== undefined ? { fees: input.fees } : {}),
      ...(input.strategyId !== undefined ? { strategyId: input.strategyId } : {}),
      ...(input.setupId !== undefined ? { setupId: input.setupId } : {}),
      ...(input.entryReason !== undefined ? { entryReason: input.entryReason } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.mistakesNotes !== undefined ? { mistakesNotes: input.mistakesNotes } : {}),
      ...(input.whatWentWell !== undefined ? { whatWentWell: input.whatWentWell } : {}),
      ...(input.lessonsLearned !== undefined ? { lessonsLearned: input.lessonsLearned } : {}),
      ...(input.tradingPlan !== undefined ? { tradingPlan: input.tradingPlan } : {}),
      ...(input.followedPlan !== undefined ? { followedPlan: input.followedPlan } : {}),
      ...(input.emotionalState !== undefined ? { emotionalState: input.emotionalState } : {}),
      grossPnl: pnl.grossPnl,
      netPnl: pnl.netPnl,
      returnPct: pnl.returnPct,
      status: resolvedExitPrice != null ? "CLOSED" : "OPEN",
    },
  });

  if (input.tagIds) await setTradeTags(trade.id, input.tagIds);
  if (input.mistakeCategoryIds) await setTradeMistakes(trade.id, input.mistakeCategoryIds);

  return serialize(trade);
}

export async function deleteTrade(userId: string, id: string) {
  await findOwnedTradeOrThrow(userId, id);
  await prisma.trade.delete({ where: { id } });
}
