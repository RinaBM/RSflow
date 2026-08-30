import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EquityCurvePoint } from "@rs-flow/shared";
import { cn } from "@/lib/utils";

const RANGES = ["1M", "3M", "YTD", "ALL"] as const;
type Range = (typeof RANGES)[number];

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatAxisDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function cutoffFor(range: Range, latest: Date): Date | null {
  const cutoff = new Date(latest);
  if (range === "1M") {
    cutoff.setMonth(cutoff.getMonth() - 1);
    return cutoff;
  }
  if (range === "3M") {
    cutoff.setMonth(cutoff.getMonth() - 3);
    return cutoff;
  }
  if (range === "YTD") {
    return new Date(latest.getFullYear(), 0, 1);
  }
  return null;
}

interface TooltipPayloadItem {
  payload: EquityCurvePoint;
}

function EquityTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-md border border-primary/30 bg-card px-3 py-2 text-xs shadow-[0_0_18px_-4px_rgba(34,211,238,0.35)]">
      <div className="text-muted-foreground">{new Date(point.date).toLocaleString()}</div>
      <div className={`mt-0.5 font-mono font-semibold ${point.cumulativePnl >= 0 ? "text-profit" : "text-loss"}`}>
        {formatCurrency(point.cumulativePnl)}
      </div>
    </div>
  );
}

export function EquityCurveChart({ data, bare = false }: { data: EquityCurvePoint[]; bare?: boolean }) {
  const [range, setRange] = useState<Range>("ALL");

  const filtered = useMemo(() => {
    if (data.length === 0) return data;
    const latest = new Date(data[data.length - 1]!.date);
    const cutoff = cutoffFor(range, latest);
    if (!cutoff) return data;
    return data.filter((point) => new Date(point.date) >= cutoff);
  }, [data, range]);

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex h-64 items-center justify-center text-sm text-muted-foreground",
          !bare && "rounded-lg border border-border bg-card",
        )}
      >
        Close a trade to start building your equity curve.
      </div>
    );
  }

  return (
    <div className={cn(!bare && "rounded-lg border border-border bg-card p-4")}>
      <div className="mb-2 flex items-center justify-end">
        <div className="flex gap-0.5 rounded-full border border-border bg-background p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors",
                range === r
                  ? "bg-gradient-to-r from-primary/30 to-violet/25 text-foreground shadow-[0_0_12px_-3px_rgba(34,211,238,0.6)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 [filter:drop-shadow(0_0_8px_rgba(34,211,238,0.35))]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.32} />
                <stop offset="55%" stopColor="var(--violet)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={72}
            />
            <ReferenceLine y={0} stroke="var(--border)" />
            <Tooltip content={<EquityTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulativePnl"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#equityFill)"
              dot={false}
              activeDot={{ r: 4.5, strokeWidth: 2, stroke: "var(--card)", fill: "var(--primary)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
