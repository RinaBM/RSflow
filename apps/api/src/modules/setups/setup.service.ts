import { Prisma, type Setup } from "@prisma/client";
import type { CreateSetupInput, UpdateSetupInput } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";

function serialize(setup: Setup) {
  return {
    id: setup.id,
    userId: setup.userId,
    name: setup.name,
    description: setup.description,
    createdAt: setup.createdAt.toISOString(),
  };
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function listSetups(userId: string) {
  const setups = await prisma.setup.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return setups.map(serialize);
}

export async function createSetup(userId: string, input: CreateSetupInput) {
  try {
    const setup = await prisma.setup.create({ data: { ...input, userId } });
    return serialize(setup);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A setup with this name already exists");
    }
    throw error;
  }
}

async function findOwnedSetupOrThrow(userId: string, id: string) {
  const setup = await prisma.setup.findFirst({ where: { id, userId } });
  if (!setup) {
    throw AppError.notFound("Setup not found");
  }
  return setup;
}

export async function updateSetup(userId: string, id: string, input: UpdateSetupInput) {
  await findOwnedSetupOrThrow(userId, id);
  try {
    const setup = await prisma.setup.update({ where: { id }, data: input });
    return serialize(setup);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A setup with this name already exists");
    }
    throw error;
  }
}

export async function deleteSetup(userId: string, id: string) {
  await findOwnedSetupOrThrow(userId, id);
  await prisma.setup.delete({ where: { id } });
}
