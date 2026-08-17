import { Prisma, type Tag } from "@prisma/client";
import type { CreateTagInput, UpdateTagInput } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";

function serialize(tag: Tag) {
  return {
    id: tag.id,
    userId: tag.userId,
    name: tag.name,
    color: tag.color,
    createdAt: tag.createdAt.toISOString(),
  };
}

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function listTags(userId: string) {
  const tags = await prisma.tag.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return tags.map(serialize);
}

export async function createTag(userId: string, input: CreateTagInput) {
  try {
    const tag = await prisma.tag.create({ data: { ...input, userId } });
    return serialize(tag);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A tag with this name already exists");
    }
    throw error;
  }
}

async function findOwnedTagOrThrow(userId: string, id: string) {
  const tag = await prisma.tag.findFirst({ where: { id, userId } });
  if (!tag) {
    throw AppError.notFound("Tag not found");
  }
  return tag;
}

export async function updateTag(userId: string, id: string, input: UpdateTagInput) {
  await findOwnedTagOrThrow(userId, id);
  try {
    const tag = await prisma.tag.update({ where: { id }, data: input });
    return serialize(tag);
  } catch (error) {
    if (isUniqueConflict(error)) {
      throw AppError.conflict("A tag with this name already exists");
    }
    throw error;
  }
}

export async function deleteTag(userId: string, id: string) {
  await findOwnedTagOrThrow(userId, id);
  await prisma.tag.delete({ where: { id } });
}
