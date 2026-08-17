import { Prisma, type MistakeCategory } from "@prisma/client";
import type { CreateMistakeCategoryInput, UpdateMistakeCategoryInput } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";

function serialize(category: MistakeCategory) {
  return {
    id: category.id,
    userId: category.userId,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
  };
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function listMistakeCategories(userId: string) {
  const categories = await prisma.mistakeCategory.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return categories.map(serialize);
}

export async function createMistakeCategory(userId: string, input: CreateMistakeCategoryInput) {
  try {
    const category = await prisma.mistakeCategory.create({ data: { ...input, userId } });
    return serialize(category);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A mistake category with this name already exists");
    }
    throw error;
  }
}

async function findOwnedCategoryOrThrow(userId: string, id: string) {
  const category = await prisma.mistakeCategory.findFirst({ where: { id, userId } });
  if (!category) {
    throw AppError.notFound("Mistake category not found");
  }
  return category;
}

export async function updateMistakeCategory(userId: string, id: string, input: UpdateMistakeCategoryInput) {
  await findOwnedCategoryOrThrow(userId, id);
  try {
    const category = await prisma.mistakeCategory.update({ where: { id }, data: input });
    return serialize(category);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A mistake category with this name already exists");
    }
    throw error;
  }
}

export async function deleteMistakeCategory(userId: string, id: string) {
  await findOwnedCategoryOrThrow(userId, id);
  await prisma.mistakeCategory.delete({ where: { id } });
}
