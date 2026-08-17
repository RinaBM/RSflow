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
import type { Trade } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useTradingAccounts } from "@/features/trading-accounts/hooks";
import { useDeleteTrade, useTrades } from "@/features/trades/hooks";
import { TradeFormDialog } from "@/features/trades/trade-form-dialog";

const PAGE_SIZE = 25;

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
    if (!window.confirm(`Delete the ${trade.symbol} trade?`)) return;
    deleteTrade.mutate(trade.id, {
      onError: (err) => window.alert(err instanceof ApiError ? err.message : "Failed to delete trade"),
    });
  }

  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => (
          <Link to={`/journal/${row.original.id}`} className="font-medium hover:underline">
            {row.original.symbol}
          </Link>
        ),
      },
      {
        accessorKey: "side",
        header: "Side",
        cell: ({ row }) => (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            {row.original.side}
          </span>
        ),
      },
      {
        accessorKey: "entryTime",
        header: "Entry",
        cell: ({ row }) => formatDateTime(row.original.entryTime),
      },
      {
        accessorKey: "exitTime",
        header: "Exit",
        cell: ({ row }) => formatDateTime(row.original.exitTime),
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        cell: ({ row }) => formatNumber(row.original.quantity, 0),
      },
      {
        accessorKey: "netPnl",
        header: "Net P&L",
        cell: ({ row }) => {
          const value = row.original.netPnl;
          return (
            <span className={cn("font-medium", value == null ? "" : value >= 0 ? "text-profit" : "text-loss")}>
              {value == null ? "—" : `${value >= 0 ? "+" : ""}${formatNumber(value)}`}
            </span>
          );
        },
      },
      {
        accessorKey: "returnPct",
        header: "Return %",
        cell: ({ row }) => (row.original.returnPct == null ? "—" : `${formatNumber(row.original.returnPct)}%`),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
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
              <Link to={`/journal/${row.original.id}`} title="Review">
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
    [],
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
          <p className="text-sm text-muted-foreground">Search, filter and manage every trade.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New trade
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search symbol…"
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
          <option value="">All accounts</option>
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
          <option value="">Long &amp; Short</option>
          <option value="LONG">Long</option>
          <option value="SHORT">Short</option>
        </Select>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-32"
        >
          <option value="">Open &amp; Closed</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Loading trades…
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : "Failed to load trades"}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          No trades match these filters.
          <Button variant="outline" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Log your first trade
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-3 text-left font-medium text-muted-foreground",
                          header.column.getCanSort() && "cursor-pointer select-none",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="inline-flex items-center gap-1">
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
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
            <span>
              Page {data?.page ?? 1} of {data?.totalPages ?? 1} · {data?.total ?? 0} trades
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data || page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
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
