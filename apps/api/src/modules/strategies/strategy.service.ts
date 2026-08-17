import { Prisma, type Strategy } from "@prisma/client";
import type { CreateStrategyInput, UpdateStrategyInput } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";

function serialize(strategy: Strategy) {
  return {
    id: strategy.id,
    userId: strategy.userId,
    name: strategy.name,
    description: strategy.description,
    createdAt: strategy.createdAt.toISOString(),
  };
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function listStrategies(userId: string) {
  const strategies = await prisma.strategy.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return strategies.map(serialize);
}

export async function createStrategy(userId: string, input: CreateStrategyInput) {
  try {
    const strategy = await prisma.strategy.create({ data: { ...input, userId } });
    return serialize(strategy);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A strategy with this name already exists");
    }
    throw error;
  }
}

async function findOwnedStrategyOrThrow(userId: string, id: string) {
  const strategy = await prisma.strategy.findFirst({ where: { id, userId } });
  if (!strategy) {
    throw AppError.notFound("Strategy not found");
  }
  return strategy;
}

export async function updateStrategy(userId: string, id: string, input: UpdateStrategyInput) {
  await findOwnedStrategyOrThrow(userId, id);
  try {
    const strategy = await prisma.strategy.update({ where: { id }, data: input });
    return serialize(strategy);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A strategy with this name already exists");
    }
    throw error;
  }
}

export async function deleteStrategy(userId: string, id: string) {
  await findOwnedStrategyOrThrow(userId, id);
  await prisma.strategy.delete({ where: { id } });
}
