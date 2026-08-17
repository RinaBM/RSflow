import type { TradeSide } from "@rs-flow/shared";

export interface PnlInput {
  side: TradeSide;
  entryPrice: number;
  exitPrice: number | null | undefined;
  quantity: number;
  fees: number;
}

export interface PnlResult {
  grossPnl: number | null;
  netPnl: number | null;
  returnPct: number | null;
}

export function computeTradePnl(input: PnlInput): PnlResult {
  const { side, entryPrice, exitPrice, quantity, fees } = input;

  if (exitPrice == null) {
    return { grossPnl: null, netPnl: null, returnPct: null };
  }

  const grossPnl = side === "LONG" ? (exitPrice - entryPrice) * quantity : (entryPrice - exitPrice) * quantity;
  const netPnl = grossPnl - fees;
  const costBasis = entryPrice * quantity;
  const returnPct = costBasis === 0 ? null : (netPnl / costBasis) * 100;

  return { grossPnl, netPnl, returnPct };
}
