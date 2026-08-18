import { describe, expect, it } from "vitest";
import {
  buildEquityCurve,
  calculateAverageHoldingTimeMinutes,
  calculateAverageRiskReward,
  calculateMaxConsecutive,
  calculateMaxDrawdown,
  calculateProfitFactor,
  calculateWinRate,
  computeDashboardMetrics,
  groupNetPnlByTradingDay,
  summarizeTradingDays,
  type AnalyticsTrade,
} from "./metrics.js";

function trade(overrides: Partial<AnalyticsTrade> & { id: string }): AnalyticsTrade {
  return {
    symbol: "AAPL",
    side: "LONG",
    status: "CLOSED",
    entryTime: new Date("2026-01-01T14:00:00Z"),
    exitTime: new Date("2026-01-01T15:00:00Z"),
    netPnl: 0,
    strategyId: null,
    strategyName: null,
    setupId: null,
    setupName: null,
    ...overrides,
  };
}

describe("calculateWinRate", () => {
  it("computes the percentage of winners out of closed trades", () => {
    expect(calculateWinRate(3, 5)).toBeCloseTo(60);
  });

  it("returns null when there are no closed trades", () => {
    expect(calculateWinRate(0, 0)).toBeNull();
  });
});

describe("calculateProfitFactor", () => {
  it("divides gross profit by gross loss", () => {
    expect(calculateProfitFactor(300, 100)).toBeCloseTo(3);
  });

  it("returns null when there are no losses (avoids divide-by-zero)", () => {
    expect(calculateProfitFactor(300, 0)).toBeNull();
  });
});

describe("calculateAverageRiskReward", () => {
  it("computes the ratio of average winner to average loser magnitude", () => {
    expect(calculateAverageRiskReward(200, -100)).toBeCloseTo(2);
  });

  it("returns null when there is no average loser", () => {
    expect(calculateAverageRiskReward(200, null)).toBeNull();
    expect(calculateAverageRiskReward(200, 0)).toBeNull();
  });
});

describe("calculateAverageHoldingTimeMinutes", () => {
  it("averages the holding time across closed trades", () => {
    const trades = [
      trade({ id: "1", entryTime: new Date("2026-01-01T10:00:00Z"), exitTime: new Date("2026-01-01T10:30:00Z") }),
      trade({ id: "2", entryTime: new Date("2026-01-01T10:00:00Z"), exitTime: new Date("2026-01-01T11:30:00Z") }),
    ] as never;

    expect(calculateAverageHoldingTimeMinutes(trades)).toBeCloseTo(60); // (30 + 90) / 2
  });

  it("returns null for an empty list", () => {
    expect(calculateAverageHoldingTimeMinutes([])).toBeNull();
  });
});

describe("calculateMaxConsecutive", () => {
  it("finds the longest streak matching the predicate, resetting on a break", () => {
    const netPnls = [10, 10, -5, 10, 10, 10, -5, -5];
    const trades = netPnls.map((netPnl, i) => trade({ id: String(i), netPnl }));
    const longestWinStreak = calculateMaxConsecutive(trades as never, (t) => t.netPnl > 0);
    const longestLossStreak = calculateMaxConsecutive(trades as never, (t) => t.netPnl < 0);

    expect(longestWinStreak).toBe(3);
    expect(longestLossStreak).toBe(2);
  });

  it("treats a breakeven trade as breaking both win and loss streaks", () => {
    const netPnls = [10, 10, 0, 10];
    const trades = netPnls.map((netPnl, i) => trade({ id: String(i), netPnl }));
    expect(calculateMaxConsecutive(trades as never, (t) => t.netPnl > 0)).toBe(2);
  });
});

describe("groupNetPnlByTradingDay", () => {
  it("sums net P&L for trades closed on the same day and keeps different days separate", () => {
    const trades = [
      trade({ id: "1", netPnl: 50, exitTime: new Date("2026-01-01T15:00:00Z") }),
      trade({ id: "2", netPnl: 30, exitTime: new Date("2026-01-01T18:00:00Z") }),
      trade({ id: "3", netPnl: -20, exitTime: new Date("2026-01-02T15:00:00Z") }),
    ] as never;

    const byDay = groupNetPnlByTradingDay(trades);
    expect(byDay.get("2026-01-01")).toBe(80);
    expect(byDay.get("2026-01-02")).toBe(-20);
  });
});

describe("summarizeTradingDays", () => {
  it("aggregates net P&L and trade count per day, sorted chronologically, ignoring open trades", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", netPnl: 50, exitTime: new Date("2026-01-02T15:00:00Z") }),
      trade({ id: "2", netPnl: 30, exitTime: new Date("2026-01-01T18:00:00Z") }),
      trade({ id: "3", netPnl: -20, exitTime: new Date("2026-01-01T15:00:00Z") }),
      trade({ id: "4", status: "OPEN", exitTime: null, netPnl: null }),
    ];

    const summary = summarizeTradingDays(trades);

    expect(summary).toEqual([
      { date: "2026-01-01", netPnl: 10, tradeCount: 2 },
      { date: "2026-01-02", netPnl: 50, tradeCount: 1 },
    ]);
  });

  it("returns an empty array when there are no closed trades", () => {
    expect(summarizeTradingDays([])).toEqual([]);
  });
});

describe("buildEquityCurve", () => {
  it("produces a running cumulative sum in chronological order", () => {
    const trades = [
      trade({ id: "1", netPnl: 100, exitTime: new Date("2026-01-01T15:00:00Z") }),
      trade({ id: "2", netPnl: -30, exitTime: new Date("2026-01-02T15:00:00Z") }),
      trade({ id: "3", netPnl: 20, exitTime: new Date("2026-01-03T15:00:00Z") }),
    ] as never;

    const curve = buildEquityCurve(trades);
    expect(curve.map((p) => p.cumulativePnl)).toEqual([100, 70, 90]);
  });
});

describe("calculateMaxDrawdown", () => {
  it("finds the largest peak-to-trough decline in the equity curve", () => {
    const curve = [{ cumulativePnl: 100 }, { cumulativePnl: 150 }, { cumulativePnl: 60 }, { cumulativePnl: 90 }];
    // peak reaches 150, trough after that is 60 -> drawdown of 90
    expect(calculateMaxDrawdown(curve)).toBe(90);
  });

  it("returns 0 for an ever-increasing curve", () => {
    const curve = [{ cumulativePnl: 10 }, { cumulativePnl: 20 }, { cumulativePnl: 30 }];
    expect(calculateMaxDrawdown(curve)).toBe(0);
  });
});

describe("computeDashboardMetrics", () => {
  it("aggregates a realistic mix of trades correctly", () => {
    const trades: AnalyticsTrade[] = [
      trade({ id: "1", netPnl: 100, exitTime: new Date("2026-01-01T15:00:00Z") }),
      trade({ id: "2", netPnl: -40, exitTime: new Date("2026-01-02T15:00:00Z") }),
      trade({ id: "3", netPnl: 60, exitTime: new Date("2026-01-03T15:00:00Z") }),
      trade({ id: "4", status: "OPEN", exitTime: null, netPnl: null }),
    ];

    const metrics = computeDashboardMetrics(trades);

    expect(metrics.totalTrades).toBe(4);
    expect(metrics.closedTrades).toBe(3);
    expect(metrics.openTrades).toBe(1);
    expect(metrics.winningTrades).toBe(2);
    expect(metrics.losingTrades).toBe(1);
    expect(metrics.netPnl).toBeCloseTo(120);
    expect(metrics.grossProfit).toBeCloseTo(160);
    expect(metrics.grossLoss).toBeCloseTo(40);
    expect(metrics.profitFactor).toBeCloseTo(4);
    expect(metrics.bestTrade?.id).toBe("1");
    expect(metrics.worstTrade?.id).toBe("2");
    expect(metrics.maxConsecutiveWins).toBe(1);
  });

  it("does not crash and returns neutral values when there are no trades", () => {
    const metrics = computeDashboardMetrics([]);

    expect(metrics.totalTrades).toBe(0);
    expect(metrics.winRate).toBeNull();
    expect(metrics.profitFactor).toBeNull();
    expect(metrics.bestTrade).toBeNull();
    expect(metrics.maxDrawdown).toBe(0);
    expect(metrics.equityCurve).toEqual([]);
  });
});
