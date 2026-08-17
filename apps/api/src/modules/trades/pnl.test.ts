import { describe, expect, it } from "vitest";
import { computeTradePnl } from "./pnl.js";

describe("computeTradePnl", () => {
  it("returns nulls for an open trade (no exit price)", () => {
    const result = computeTradePnl({
      side: "LONG",
      entryPrice: 100,
      exitPrice: undefined,
      quantity: 10,
      fees: 0,
    });

    expect(result).toEqual({ grossPnl: null, netPnl: null, returnPct: null });
  });

  it("computes a winning LONG trade", () => {
    const result = computeTradePnl({
      side: "LONG",
      entryPrice: 100,
      exitPrice: 110,
      quantity: 10,
      fees: 5,
    });

    expect(result.grossPnl).toBeCloseTo(100); // (110 - 100) * 10
    expect(result.netPnl).toBeCloseTo(95); // 100 - 5 fees
    expect(result.returnPct).toBeCloseTo(9.5); // 95 / (100*10) * 100
  });

  it("computes a losing LONG trade", () => {
    const result = computeTradePnl({
      side: "LONG",
      entryPrice: 100,
      exitPrice: 90,
      quantity: 10,
      fees: 0,
    });

    expect(result.grossPnl).toBeCloseTo(-100);
    expect(result.netPnl).toBeCloseTo(-100);
    expect(result.returnPct).toBeCloseTo(-10);
  });

  it("computes a winning SHORT trade", () => {
    const result = computeTradePnl({
      side: "SHORT",
      entryPrice: 100,
      exitPrice: 90,
      quantity: 10,
      fees: 0,
    });

    expect(result.grossPnl).toBeCloseTo(100); // (100 - 90) * 10
    expect(result.netPnl).toBeCloseTo(100);
    expect(result.returnPct).toBeCloseTo(10);
  });

  it("computes a losing SHORT trade", () => {
    const result = computeTradePnl({
      side: "SHORT",
      entryPrice: 100,
      exitPrice: 110,
      quantity: 10,
      fees: 0,
    });

    expect(result.grossPnl).toBeCloseTo(-100); // (100 - 110) * 10
    expect(result.netPnl).toBeCloseTo(-100);
  });

  it("subtracts fees from gross to reach net, even to the point of flipping a small winner into a loss", () => {
    const result = computeTradePnl({
      side: "LONG",
      entryPrice: 100,
      exitPrice: 101,
      quantity: 1,
      fees: 5,
    });

    expect(result.grossPnl).toBeCloseTo(1);
    expect(result.netPnl).toBeCloseTo(-4);
  });

  it("returns a null returnPct when cost basis is zero", () => {
    const result = computeTradePnl({
      side: "LONG",
      entryPrice: 0,
      exitPrice: 10,
      quantity: 5,
      fees: 0,
    });

    expect(result.returnPct).toBeNull();
  });
});
