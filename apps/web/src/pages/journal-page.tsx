import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, NotebookText, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Trade } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useTradingAccounts } from "@/features/trading-accounts/hooks";
import { useDeleteTrade, useTrades } from "@/features/trades/hooks";
import { TradeFormDialog } from "@/features/trades/trade-form-dialog";

const PAGE_SIZE = 25;
const NUMERIC_COLUMN_IDS = new Set(["quantity", "netPnl", "returnPct"]);

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value: number | null, digits = 2) {
  if (value == null) return "—";
  return value.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function JournalPage() {
  const { t } = useTranslation();
  const { data: accountsData } = useTradingAccounts();
  const deleteTrade = useDeleteTrade();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([{ id: "entryTime", desc: true }]);
  const [tradingAccountId, setTradingAccountId] = useState("");
  const [symbolInput, setSymbolInput] = useState("");
  const [side, setSide] = useState("");
  const [status, setStatus] = useState("");

  const symbol = useDebouncedValue(symbolInput);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | undefined>(undefined);

  const activeSort = sorting[0];

  const { data, isLoading, isError, error } = useTrades({
    page,
    pageSize: PAGE_SIZE,
    sort: activeSort?.id ?? "entryTime",
    order: activeSort?.desc ? "desc" : "asc",
    tradingAccountId: tradingAccountId || undefined,
    symbol: symbol || undefined,
    side: (side || undefined) as "LONG" | "SHORT" | undefined,
    status: (status || undefined) as "OPEN" | "CLOSED" | undefined,
  });

  function openCreateDialog() {
    setEditingTrade(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(trade: Trade) {
    setEditingTrade(trade);
    setDialogOpen(true);
  }

  function handleDelete(trade: Trade) {
    if (!window.confirm(t("journal.deleteConfirm", { symbol: trade.symbol }))) return;
    deleteTrade.mutate(trade.id, {
      onError: (err) => window.alert(err instanceof ApiError ? err.message : t("journal.deleteFailed")),
    });
  }

  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: t("journal.columns.symbol"),
        cell: ({ row }) => (
          <Link to={`/journal/${row.original.id}`} className="font-medium hover:underline">
            {row.original.symbol}
          </Link>
        ),
      },
      {
        accessorKey: "side",
        header: t("journal.columns.side"),
        cell: ({ row }) => (
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              row.original.side === "LONG"
                ? "border-profit/40 bg-profit/10 text-profit"
                : "border-loss/40 bg-loss/10 text-loss",
            )}
          >
            {row.original.side}
          </span>
        ),
      },
      {
        accessorKey: "entryTime",
        header: t("journal.columns.entry"),
        cell: ({ row }) => (
          <span className="text-muted-foreground" dir="ltr">
            {formatDateTime(row.original.entryTime)}
          </span>
        ),
      },
      {
        accessorKey: "exitTime",
        header: t("journal.columns.exit"),
        cell: ({ row }) => (
          <span className="text-muted-foreground" dir="ltr">
            {formatDateTime(row.original.exitTime)}
          </span>
        ),
      },
      {
        accessorKey: "quantity",
        header: t("journal.columns.qty"),
        cell: ({ row }) => formatNumber(row.original.quantity, 0),
      },
      {
        accessorKey: "netPnl",
        header: t("journal.columns.netPnl"),
        cell: ({ row }) => {
          const value = row.original.netPnl;
          return (
            <span className={cn("font-semibold", value == null ? "" : value >= 0 ? "text-profit" : "text-loss")}>
              {value == null ? "—" : `${value >= 0 ? "+" : ""}${formatNumber(value)}`}
            </span>
          );
        },
      },
      {
        accessorKey: "returnPct",
        header: t("journal.columns.returnPct"),
        cell: ({ row }) => (row.original.returnPct == null ? "—" : `${formatNumber(row.original.returnPct)}%`),
      },
      {
        accessorKey: "status",
        header: t("journal.columns.status"),
        cell: ({ row }) => (
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              row.original.status === "OPEN"
                ? "border-status-open/40 bg-status-open/10 text-status-open"
                : "border-border text-muted-foreground",
            )}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/journal/${row.original.id}`} title={t("journal.review")}>
                <NotebookText className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openEditDialog(row.original)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleDelete/openEditDialog close over stable setters only
    [t],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1);
    },
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("journal.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("journal.subtitle")}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          {t("journal.newTrade")}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("journal.searchSymbol")}
          value={symbolInput}
          onChange={(e) => {
            setSymbolInput(e.target.value);
            setPage(1);
          }}
          className="w-40"
        />
        <Select
          value={tradingAccountId}
          onChange={(e) => {
            setTradingAccountId(e.target.value);
            setPage(1);
          }}
          className="w-44"
        >
          <option value="">{t("filters.allAccounts")}</option>
          {accountsData?.items.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
        <Select
          value={side}
          onChange={(e) => {
            setSide(e.target.value);
            setPage(1);
          }}
          className="w-32"
        >
          <option value="">{t("filters.longShort")}</option>
          <option value="LONG">{t("filters.long")}</option>
          <option value="SHORT">{t("filters.short")}</option>
        </Select>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-32"
        >
          <option value="">{t("journal.openClosed")}</option>
          <option value="OPEN">{t("journal.open")}</option>
          <option value="CLOSED">{t("journal.closed")}</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t("journal.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : t("journal.loadFailed")}
        </div>
      ) : data?.items.length === 0 ? (
        <EmptyState
          icon={NotebookText}
          title={t("journal.emptyTitle")}
          description={t("journal.emptyDescription")}
          action={
            <Button variant="outline" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              {t("journal.logFirstTrade")}
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-surface-2">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();
                    const numeric = NUMERIC_COLUMN_IDS.has(header.column.id);
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
                          numeric && "text-right",
                          header.column.getCanSort() && "cursor-pointer select-none",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className={cn("inline-flex items-center gap-1", numeric && "flex-row-reverse")}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : sortDirection === "desc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-40" />
                            )
                          ) : null}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-2.5",
                        NUMERIC_COLUMN_IDS.has(cell.column.id) && "text-right font-mono tabular-nums",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col items-center justify-between gap-2 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row">
            <span>
              {t("journal.pageOf", { page: data?.page ?? 1, totalPages: data?.totalPages ?? 1 })} ·{" "}
              {t("journal.tradesCount", { count: data?.total ?? 0 })}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {t("journal.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data || page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("journal.next")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <TradeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} trade={editingTrade} />
    </div>
  );
}
