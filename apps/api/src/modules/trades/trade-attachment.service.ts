import type { TradeAttachment } from "@prisma/client";
import type { CreateAttachmentInput } from "@rs-flow/shared";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";

function serialize(attachment: TradeAttachment) {
  return {
    id: attachment.id,
    tradeId: attachment.tradeId,
    url: attachment.url,
    type: attachment.type,
    caption: attachment.caption,
    createdAt: attachment.createdAt.toISOString(),
  };
}

async function assertOwnsTrade(userId: string, tradeId: string) {
  const trade = await prisma.trade.findFirst({ where: { id: tradeId, userId }, select: { id: true } });
  if (!trade) {
    throw AppError.notFound("Trade not found");
  }
}

export async function listAttachments(userId: string, tradeId: string) {
  await assertOwnsTrade(userId, tradeId);
  const attachments = await prisma.tradeAttachment.findMany({
    where: { tradeId },
    orderBy: { createdAt: "asc" },
  });
  return attachments.map(serialize);
}

export async function createAttachment(userId: string, tradeId: string, input: CreateAttachmentInput) {
  await assertOwnsTrade(userId, tradeId);
  const attachment = await prisma.tradeAttachment.create({ data: { ...input, tradeId } });
  return serialize(attachment);
}

export async function deleteAttachment(userId: string, tradeId: string, attachmentId: string) {
  await assertOwnsTrade(userId, tradeId);
  const attachment = await prisma.tradeAttachment.findFirst({ where: { id: attachmentId, tradeId } });
  if (!attachment) {
    throw AppError.notFound("Attachment not found");
  }
  await prisma.tradeAttachment.delete({ where: { id: attachmentId } });
}
