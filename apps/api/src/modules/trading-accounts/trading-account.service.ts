import type { CreateTradingAccountInput, UpdateTradingAccountInput } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";
import type { TradingAccount } from "@prisma/client";

function serialize(account: TradingAccount) {
  return {
    id: account.id,
    userId: account.userId,
    name: account.name,
    broker: account.broker,
    currency: account.currency,
    startingBalance: Number(account.startingBalance),
    isActive: account.isActive,
    createdAt: account.createdAt.toISOString(),
  };
}

export async function listTradingAccounts(userId: string) {
  const accounts = await prisma.tradingAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return accounts.map(serialize);
}

export async function createTradingAccount(userId: string, input: CreateTradingAccountInput) {
  const account = await prisma.tradingAccount.create({
    data: { ...input, userId },
  });
  return serialize(account);
}

async function findOwnedAccountOrThrow(userId: string, id: string) {
  const account = await prisma.tradingAccount.findFirst({ where: { id, userId } });
  if (!account) {
    throw AppError.notFound("Trading account not found");
  }
  return account;
}

export async function updateTradingAccount(
  userId: string,
  id: string,
  input: UpdateTradingAccountInput,
) {
  await findOwnedAccountOrThrow(userId, id);
  const account = await prisma.tradingAccount.update({ where: { id }, data: input });
  return serialize(account);
}

export async function deleteTradingAccount(userId: string, id: string) {
  await findOwnedAccountOrThrow(userId, id);

  const tradeCount = await prisma.trade.count({ where: { tradingAccountId: id } });
  if (tradeCount > 0) {
    throw AppError.conflict(
      "Cannot delete a trading account that has trades. Deactivate it instead.",
    );
  }

  await prisma.tradingAccount.delete({ where: { id } });
}
