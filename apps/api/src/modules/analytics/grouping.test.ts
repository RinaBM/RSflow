import { describe, expect, it } from "vitest";
import {
  computeWinLossDistribution,
  performanceByDayOfWeek,
  performanceByHour,
  performanceBySetup,
  performanceBySide,
  performanceByStrategy,
  performanceBySymbol,
} from "./grouping.js";
import type { AnalyticsTrade } from "./metrics.js";

function trade(overrides: Partial<AnalyticsTrade> & { id: string }): AnalyticsTrade {
  return {
    symbol: "AAPL",
    side: "LONG",
    status: "CLOSED",
    entryTime: new Date("2026-01-05T14:00:00Z"), // a Monday
    exitTime: new Date("2026-01-05T15:00:00Z"),
    netPnl: 0,
    strategyId: null,
    strategyName: null,
    setupId: null,
    setupName: null,
    ...overrides,
  };
}

describe("performanceBySymbol", () => {
  it("groups by symbol, computes per-group metrics, and sorts by net P&L descending", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", symbol: "AAPL", netPnl: 100 }),
      trade({ id: "2", symbol: "AAPL", netPnl: -40 }),
      trade({ id: "3", symbol: "TSLA", netPnl: 200 }),
      trade({ id: "4", status: "OPEN", exitTime: null, netPnl: null }), // ignored (open)
    ];

    const result = performanceBySymbol(trades);

    expect(result).toEqual([
      { key: "TSLA", label: "TSLA", tradeCount: 1, netPnl: 200, winRate: 100, averageTrade: 200, profitFactor: null },
      { key: "AAPL", label: "AAPL", tradeCount: 2, netPnl: 60, winRate: 50, averageTrade: 30, profitFactor: 2.5 },
    ]);
  });
});

describe("performanceByStrategy", () => {
  it("buckets trades with no strategy under a 'No strategy' label instead of dropping them", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", strategyId: "s1", strategyName: "Breakout", netPnl: 50 }),
      trade({ id: "2", strategyId: null, netPnl: -10 }),
    ];

    const result = performanceByStrategy(trades);

    expect(result.find((g) => g.key === "none")?.label).toBe("No strategy");
    expect(result.find((g) => g.key === "s1")?.label).toBe("Breakout");
  });
});

describe("performanceBySetup", () => {
  it("buckets trades with no setup under a 'No setup' label", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", setupId: "su1", setupName: "VWAP pullback", netPnl: 20 }),
      trade({ id: "2", setupId: null, netPnl: 5 }),
    ];

    const result = performanceBySetup(trades);

    expect(result.find((g) => g.key === "none")?.label).toBe("No setup");
    expect(result.find((g) => g.key === "su1")?.label).toBe("VWAP pullback");
  });
});

describe("performanceBySide", () => {
  it("compares long vs short performance", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", side: "LONG", netPnl: 100 }),
      trade({ id: "2", side: "SHORT", netPnl: -30 }),
      trade({ id: "3", side: "SHORT", netPnl: 10 }),
    ];

    const result = performanceBySide(trades);
    const long = result.find((g) => g.key === "LONG");
    const short = result.find((g) => g.key === "SHORT");

    expect(long).toMatchObject({ tradeCount: 1, netPnl: 100 });
    expect(short).toMatchObject({ tradeCount: 2, netPnl: -20 });
  });
});

describe("performanceByHour", () => {
  it("groups by the UTC hour of exitTime and sorts chronologically", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", exitTime: new Date("2026-01-05T14:30:00Z"), netPnl: 10 }),
      trade({ id: "2", exitTime: new Date("2026-01-06T09:15:00Z"), netPnl: 20 }),
      trade({ id: "3", exitTime: new Date("2026-01-07T14:05:00Z"), netPnl: -5 }),
    ];

    const result = performanceByHour(trades);

    expect(result.map((g) => g.key)).toEqual(["9", "14"]);
    expect(result.find((g) => g.key === "14")).toMatchObject({ label: "14:00", tradeCount: 2, netPnl: 5 });
  });
});

describe("performanceByDayOfWeek", () => {
  it("groups by the UTC day of week of exitTime, only including days with trades", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", exitTime: new Date("2026-01-05T14:00:00Z"), netPnl: 10 }), // Monday
      trade({ id: "2", exitTime: new Date("2026-01-07T14:00:00Z"), netPnl: -5 }), // Wednesday
    ];

    const result = performanceByDayOfWeek(trades);

    expect(result.map((g) => g.label)).toEqual(["Monday", "Wednesday"]);
  });
});

describe("computeWinLossDistribution", () => {
  it("buckets closed trades into winners, losers and breakeven", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", netPnl: 50 }),
      trade({ id: "2", netPnl: 30 }),
      trade({ id: "3", netPnl: -20 }),
      trade({ id: "4", netPnl: 0 }),
      trade({ id: "5", status: "OPEN", exitTime: null, netPnl: null }),
    ];

    const result = computeWinLossDistribution(trades);

    expect(result).toEqual({
      winners: { count: 2, totalPnl: 80 },
      losers: { count: 1, totalPnl: -20 },
      breakEven: { count: 1 },
    });
  });
});
