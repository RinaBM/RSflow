import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PeriodSummary } from "@rs-flow/shared";

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

interface TooltipPayloadItem {
  payload: PeriodSummary;
}

function PeriodTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md">
      <div className="text-muted-foreground">{point.period}</div>
      <div className={`mt-0.5 font-semibold ${point.netPnl >= 0 ? "text-profit" : "text-loss"}`}>
        {formatCurrency(point.netPnl)}
      </div>
      <div className="text-muted-foreground">
        {point.tradeCount} trade{point.tradeCount === 1 ? "" : "s"}
      </div>
    </div>
  );
}

export function PeriodPnlChart({ title, data }: { title: string; data: PeriodSummary[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          No data for the selected filters.
        </div>
      ) : (
        <div className="h-48 rounded-xl border border-border bg-card p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="period"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                minTickGap={16}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip content={<PeriodTooltip />} cursor={{ fill: "var(--accent)" }} />
              <Bar dataKey="netPnl" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {data.map((d) => (
                  <Cell key={d.period} fill={d.netPnl >= 0 ? "var(--profit)" : "var(--loss)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
