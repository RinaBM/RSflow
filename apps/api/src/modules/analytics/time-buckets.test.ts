import { describe, expect, it } from "vitest";
import { summarizeByDay, summarizeByMonth, summarizeByWeek } from "./time-buckets.js";
import type { AnalyticsTrade } from "./metrics.js";

function trade(overrides: Partial<AnalyticsTrade> & { id: string }): AnalyticsTrade {
  return {
    symbol: "AAPL",
    side: "LONG",
    status: "CLOSED",
    entryTime: new Date("2026-01-05T14:00:00Z"),
    exitTime: new Date("2026-01-05T15:00:00Z"),
    netPnl: 0,
    strategyId: null,
    strategyName: null,
    setupId: null,
    setupName: null,
    ...overrides,
  };
}

describe("summarizeByDay", () => {
  it("aggregates net P&L and trade count per calendar day (UTC), sorted chronologically", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", exitTime: new Date("2026-01-06T15:00:00Z"), netPnl: 50 }),
      trade({ id: "2", exitTime: new Date("2026-01-05T09:00:00Z"), netPnl: 30 }),
      trade({ id: "3", exitTime: new Date("2026-01-05T20:00:00Z"), netPnl: -10 }),
      trade({ id: "4", status: "OPEN", exitTime: null, netPnl: null }),
    ];

    const result = summarizeByDay(trades);

    expect(result).toEqual([
      { period: "2026-01-05", netPnl: 20, tradeCount: 2 },
      { period: "2026-01-06", netPnl: 50, tradeCount: 1 },
    ]);
  });
});

describe("summarizeByMonth", () => {
  it("aggregates net P&L and trade count per calendar month, sorted chronologically", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", exitTime: new Date("2026-02-10T15:00:00Z"), netPnl: 50 }),
      trade({ id: "2", exitTime: new Date("2026-01-15T15:00:00Z"), netPnl: 30 }),
      trade({ id: "3", exitTime: new Date("2026-01-20T15:00:00Z"), netPnl: -10 }),
      trade({ id: "4", status: "OPEN", exitTime: null, netPnl: null }),
    ];

    const result = summarizeByMonth(trades);

    expect(result).toEqual([
      { period: "2026-01", netPnl: 20, tradeCount: 2 },
      { period: "2026-02", netPnl: 50, tradeCount: 1 },
    ]);
  });
});

describe("summarizeByWeek", () => {
  it("aggregates net P&L per ISO-8601 week, grouping the whole week under one key", () => {
    // 2026-01-05 (Mon) through 2026-01-11 (Sun) are the same ISO week
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", exitTime: new Date("2026-01-05T15:00:00Z"), netPnl: 10 }), // Mon
      trade({ id: "2", exitTime: new Date("2026-01-08T15:00:00Z"), netPnl: 20 }), // Thu
      trade({ id: "3", exitTime: new Date("2026-01-11T15:00:00Z"), netPnl: -5 }), // Sun (same ISO week)
      trade({ id: "4", exitTime: new Date("2026-01-12T15:00:00Z"), netPnl: 100 }), // Mon (next ISO week)
    ];

    const result = summarizeByWeek(trades);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ period: "2026-W02", netPnl: 25, tradeCount: 3 });
    expect(result[1]).toMatchObject({ period: "2026-W03", netPnl: 100, tradeCount: 1 });
  });

  it("assigns the correct ISO week number for a known reference date (2026-01-01 is ISO week 1)", () => {
    const trades: AnalyticsTrade[] = [trade({ id: "1", exitTime: new Date("2026-01-01T15:00:00Z"), netPnl: 1 })];
    expect(summarizeByWeek(trades)[0]?.period).toBe("2026-W01");
  });
});
