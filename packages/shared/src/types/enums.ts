export const TRADE_SIDES = ["LONG", "SHORT"] as const;
export type TradeSide = (typeof TRADE_SIDES)[number];

export const TRADE_STATUSES = ["OPEN", "CLOSED"] as const;
export type TradeStatus = (typeof TRADE_STATUSES)[number];

export const TRADE_SOURCES = ["MANUAL", "CSV", "BROKER"] as const;
export type TradeSource = (typeof TRADE_SOURCES)[number];

export const ATTACHMENT_TYPES = ["BEFORE", "AFTER"] as const;
export type AttachmentType = (typeof ATTACHMENT_TYPES)[number];

export const IMPORT_STATUSES = ["PENDING", "DONE", "FAILED"] as const;
export type ImportStatus = (typeof IMPORT_STATUSES)[number];
