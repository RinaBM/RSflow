import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { GroupPerformance } from "@rs-flow/shared";
import { cn } from "@/lib/utils";

type SortKey = "label" | "tradeCount" | "netPnl" | "winRate" | "averageTrade" | "profitFactor";

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
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          {emptyLabel ?? "No data for the selected filters."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer select-none px-4 py-2 text-left font-medium text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-1">
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
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.key} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{row.label}</td>
                  <td className="px-4 py-2">{row.tradeCount}</td>
                  <td className={cn("px-4 py-2 font-medium", row.netPnl >= 0 ? "text-profit" : "text-loss")}>
                    {formatCurrency(row.netPnl)}
                  </td>
                  <td className="px-4 py-2">{formatPercent(row.winRate)}</td>
                  <td className="px-4 py-2">{formatCurrency(row.averageTrade ?? 0)}</td>
                  <td className="px-4 py-2">{formatRatio(row.profitFactor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
