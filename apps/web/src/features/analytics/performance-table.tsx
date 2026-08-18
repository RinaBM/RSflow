import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, BarChart3 } from "lucide-react";
import type { GroupPerformance } from "@rs-flow/shared";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type SortKey = "label" | "tradeCount" | "netPnl" | "winRate" | "averageTrade" | "profitFactor";

const NUMERIC_KEYS = new Set<SortKey>(["tradeCount", "netPnl", "winRate", "averageTrade", "profitFactor"]);

const COLUMNS: { key: SortKey; header: string }[] = [
  { key: "label", header: "Name" },
  { key: "tradeCount", header: "Trades" },
  { key: "netPnl", header: "Net P&L" },
  { key: "winRate", header: "Win rate" },
  { key: "averageTrade", header: "Avg trade" },
  { key: "profitFactor", header: "Profit factor" },
];

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatPercent(value: number | null) {
  return value == null ? "—" : `${value.toFixed(1)}%`;
}

function formatRatio(value: number | null) {
  return value == null ? "—" : value.toFixed(2);
}

interface PerformanceTableProps {
  title: string;
  data: GroupPerformance[];
  emptyLabel?: string;
}

export function PerformanceTable({ title, data, emptyLabel }: PerformanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("netPnl");
  const [sortDesc, setSortDesc] = useState(true);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp =
      typeof aVal === "string" || typeof bVal === "string"
        ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
        : (aVal ?? 0) - (bVal ?? 0);
    return sortDesc ? -cmp : cmp;
  });

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">{title}</h3>
      {data.length === 0 ? (
        <EmptyState icon={BarChart3} title={emptyLabel ?? "No data for the selected filters"} />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-2">
              <tr>
                {COLUMNS.map((col) => {
                  const numeric = NUMERIC_KEYS.has(col.key);
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        "cursor-pointer select-none px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                        numeric && "text-right",
                      )}
                    >
                      <span className={cn("inline-flex items-center gap-1", numeric && "flex-row-reverse")}>
                        {col.header}
                        {sortKey === col.key ? (
                          sortDesc ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUp className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.key} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-2.5 font-medium">{row.label}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">{row.tradeCount}</td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right font-mono tabular-nums font-semibold",
                      row.netPnl >= 0 ? "text-profit" : "text-loss",
                    )}
                  >
                    {formatCurrency(row.netPnl)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatPercent(row.winRate)}</td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                    {formatCurrency(row.averageTrade ?? 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">{formatRatio(row.profitFactor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
