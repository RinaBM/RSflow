import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Clock } from "lucide-react";
import { computeTradePnl } from "@rs-flow/shared";
import type { Trade } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SteppedNumberInput } from "@/components/ui/stepped-number-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, toDatetimeLocalValue } from "@/lib/utils";
import { formatCurrency, formatHoldingTime, formatPercent } from "@/lib/format";
import { ApiError } from "@/lib/api-client";
import { contrastText } from "@/lib/color";
import { playSaveChime } from "@/lib/sound";
import { POPULAR_SYMBOLS } from "@/lib/popular-symbols";
import { useTradingAccounts } from "@/features/trading-accounts/hooks";
import { strategyHooks } from "@/features/strategies/hooks";
import { setupHooks } from "@/features/setups/hooks";
import { tagHooks } from "@/features/tags/hooks";
import { useCreateTrade, useRecentSymbols, useTrade, useUpdateTrade } from "./hooks";

interface TradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade?: Trade;
}

function toDateOrUndefined(localValue: string) {
  return localValue ? new Date(localValue) : undefined;
}

function describeError(error: unknown): string {
  if (!(error instanceof ApiError)) return "Failed to save trade";
  const details = error.details as { formErrors?: string[]; fieldErrors?: Record<string, string[]> } | undefined;
  const messages = [
    ...(details?.formErrors ?? []),
    ...Object.entries(details?.fieldErrors ?? {})
      .filter(([, msgs]) => msgs.length > 0)
      .map(([field, msgs]) => `${field}: ${msgs[0]}`),
  ];
  return messages.length > 0 ? messages.join("; ") : error.message;
}

interface QuickAddSelectProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (id: string) => void;
  items: { id: string; name: string }[] | undefined;
  onCreate: (name: string) => Promise<{ id: string }>;
  creating: boolean;
  placeholder: string;
}

function QuickAddSelect({ id, label, value, onValueChange, items, onCreate, creating, placeholder }: QuickAddSelectProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  async function handleCreate() {
    const name = draft.trim();
    if (!name) return;
    const created = await onCreate(name);
    onValueChange(created.id);
    setDraft("");
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          className="text-xs font-medium text-primary hover:underline"
        >
          {adding ? "Cancel" : "+ New"}
        </button>
      </div>
      {adding ? (
        <div className="flex gap-2">
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleCreate();
              }
            }}
          />
          <Button type="button" size="sm" disabled={!draft.trim() || creating} onClick={() => void handleCreate()}>
            Add
          </Button>
        </div>
      ) : (
        <Select id={id} value={value} onChange={(e) => onValueChange(e.target.value)}>
          <option value="">None</option>
          {items?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
}

export function TradeFormDialog({ open, onOpenChange, trade }: TradeFormDialogProps) {
  const isEdit = Boolean(trade);
  const { data: accountsData } = useTradingAccounts();
  const create = useCreateTrade();
  const update = useUpdateTrade();

  const { data: strategies } = strategyHooks.useList();
  const { data: setups } = setupHooks.useList();
  const { data: tags } = tagHooks.useList();
  const { data: recentSymbolsData } = useRecentSymbols();
  const createStrategy = strategyHooks.useCreate();
  const createSetup = setupHooks.useCreate();
  const createTag = tagHooks.useCreate();

  const symbolSuggestions = useMemo(() => {
    const recent = recentSymbolsData?.symbols ?? [];
    return [...new Set([...recent, ...POPULAR_SYMBOLS])];
  }, [recentSymbolsData]);

  const { data: detailData } = useTrade(trade?.id ?? "", { enabled: isEdit && open });

  const [tradingAccountId, setTradingAccountId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"LONG" | "SHORT">("LONG");
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fees, setFees] = useState("0");
  const [strategyId, setStrategyId] = useState("");
  const [setupId, setSetupId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [tagsHydrated, setTagsHydrated] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setTradingAccountId(trade?.tradingAccountId ?? "");
    setSymbol(trade?.symbol ?? "");
    setSide(trade?.side ?? "LONG");
    setEntryTime(trade ? toDatetimeLocalValue(trade.entryTime) : toDatetimeLocalValue(new Date().toISOString()));
    setExitTime(toDatetimeLocalValue(trade?.exitTime));
    setEntryPrice(trade?.entryPrice != null ? String(trade.entryPrice) : "");
    setExitPrice(trade?.exitPrice != null ? String(trade.exitPrice) : "");
    setQuantity(trade?.quantity != null ? String(trade.quantity) : "");
    setFees(trade?.fees != null ? String(trade.fees) : "0");
    setStrategyId(trade?.strategyId ?? "");
    setSetupId(trade?.setupId ?? "");
    setNotes(trade?.notes ?? "");
    setTagIds([]);
    setTagsHydrated(!trade);
  }, [open, trade]);

  useEffect(() => {
    if (!isEdit || !detailData) return;
    setTagIds(detailData.trade.tags.map((t) => t.id));
    setTagsHydrated(true);
  }, [isEdit, detailData]);

  const preview = useMemo(() => {
    const ep = Number(entryPrice);
    const qty = Number(quantity);
    if (!entryPrice || !quantity || Number.isNaN(ep) || Number.isNaN(qty)) {
      return null;
    }
    const xp = exitPrice ? Number(exitPrice) : null;
    const pnl = computeTradePnl({ side, entryPrice: ep, exitPrice: xp, quantity: qty, fees: Number(fees || 0) });

    let holdingMinutes: number | null = null;
    if (entryTime && exitTime) {
      const diffMs = new Date(exitTime).getTime() - new Date(entryTime).getTime();
      if (diffMs > 0) holdingMinutes = diffMs / 60000;
    }

    return { ...pnl, holdingMinutes };
  }, [side, entryPrice, exitPrice, quantity, fees, entryTime, exitTime]);

  function toggleTag(tagId: string) {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  }

  const mutation = isEdit ? update : create;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const baseInput = {
      symbol,
      side,
      entryTime: toDateOrUndefined(entryTime) as Date,
      exitTime: toDateOrUndefined(exitTime),
      entryPrice: Number(entryPrice),
      exitPrice: exitPrice ? Number(exitPrice) : undefined,
      quantity: Number(quantity),
      fees: Number(fees || 0),
      notes: notes || undefined,
      ...(tagsHydrated ? { tagIds } : {}),
    };

    const onSuccess = () => {
      playSaveChime();
      onOpenChange(false);
    };

    if (isEdit && trade) {
      // null (not undefined) so an emptied selector actually clears the field on the trade.
      update.mutate(
        {
          id: trade.id,
          ...baseInput,
          tradingAccountId: tradingAccountId || null,
          strategyId: strategyId || null,
          setupId: setupId || null,
        },
        { onSuccess },
      );
    } else {
      create.mutate(
        {
          ...baseInput,
          tradingAccountId: tradingAccountId || undefined,
          strategyId: strategyId || undefined,
          setupId: setupId || undefined,
        },
        { onSuccess },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit trade" : "New trade"}</DialogTitle>
          <DialogDescription>
            Only symbol, side, entry time, entry price and quantity are required — everything else is optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex max-h-[75vh] flex-col gap-5 overflow-y-auto pr-1">
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="trade-symbol">Symbol</Label>
              <Input
                id="trade-symbol"
                autoFocus
                required
                list="trade-symbol-suggestions"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
              <datalist id="trade-symbol-suggestions">
                {symbolSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Side</Label>
              <div className="flex overflow-hidden rounded-md border border-input">
                <button
                  type="button"
                  onClick={() => setSide("LONG")}
                  className={cn(
                    "px-4 py-1 text-sm font-medium transition-colors",
                    side === "LONG" ? "bg-profit text-profit-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setSide("SHORT")}
                  className={cn(
                    "px-4 py-1 text-sm font-medium transition-colors",
                    side === "SHORT" ? "bg-loss text-loss-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  Short
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trade-entry-time">Entry date &amp; time</Label>
                  <button
                    type="button"
                    onClick={() => setEntryTime(toDatetimeLocalValue(new Date().toISOString()))}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Clock className="h-3 w-3" />
                    Now
                  </button>
                </div>
                <Input
                  id="trade-entry-time"
                  type="datetime-local"
                  required
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trade-exit-time">Exit date &amp; time</Label>
                  <button
                    type="button"
                    onClick={() => setExitTime(toDatetimeLocalValue(new Date().toISOString()))}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Clock className="h-3 w-3" />
                    Now
                  </button>
                </div>
                <Input
                  id="trade-exit-time"
                  type="datetime-local"
                  value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trade-entry-price">Entry price</Label>
                <SteppedNumberInput
                  id="trade-entry-price"
                  value={entryPrice}
                  onChange={setEntryPrice}
                  smallStep={0.01}
                  largeStep={1}
                  min={0.0001}
                  required
                  decimals={4}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trade-exit-price">Exit price</Label>
                <SteppedNumberInput
                  id="trade-exit-price"
                  value={exitPrice}
                  onChange={setExitPrice}
                  smallStep={0.01}
                  largeStep={1}
                  min={0.0001}
                  decimals={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trade-quantity">Quantity</Label>
                <SteppedNumberInput
                  id="trade-quantity"
                  value={quantity}
                  onChange={setQuantity}
                  smallStep={1}
                  largeStep={10}
                  min={0.0001}
                  required
                  decimals={4}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trade-fees">Commission / fees</Label>
                <Input
                  id="trade-fees"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                />
              </div>
            </div>
          </div>

          {preview ? (
            <div className="grid grid-cols-4 gap-3 rounded-lg border border-border bg-muted/30 p-3 text-center">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Gross P&amp;L</div>
                <div
                  key={preview.grossPnl}
                  className={cn("value-pop font-mono text-sm font-semibold", preview.grossPnl == null ? "" : preview.grossPnl >= 0 ? "text-profit" : "text-loss")}
                >
                  {formatCurrency(preview.grossPnl)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Net P&amp;L</div>
                <div
                  key={preview.netPnl}
                  className={cn("value-pop font-mono text-sm font-semibold", preview.netPnl == null ? "" : preview.netPnl >= 0 ? "text-profit" : "text-loss")}
                >
                  {formatCurrency(preview.netPnl)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Return</div>
                <div key={preview.returnPct} className="value-pop font-mono text-sm font-semibold">
                  {formatPercent(preview.returnPct)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Holding time</div>
                <div key={preview.holdingMinutes} className="value-pop font-mono text-sm font-semibold">
                  {preview.grossPnl == null ? "Open" : formatHoldingTime(preview.holdingMinutes)}
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trade-account">Trading account (optional)</Label>
            <Select
              id="trade-account"
              value={tradingAccountId}
              onChange={(e) => setTradingAccountId(e.target.value)}
            >
              <option value="">No account</option>
              {accountsData?.items.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <QuickAddSelect
              id="trade-strategy"
              label="Strategy"
              value={strategyId}
              onValueChange={setStrategyId}
              items={strategies?.items}
              onCreate={(name) => createStrategy.mutateAsync({ name })}
              creating={createStrategy.isPending}
              placeholder="e.g. Breakout"
            />
            <QuickAddSelect
              id="trade-setup"
              label="Setup"
              value={setupId}
              onValueChange={setSetupId}
              items={setups?.items}
              onCreate={(name) => createSetup.mutateAsync({ name })}
              creating={createSetup.isPending}
              placeholder="e.g. Pullback to VWAP"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              <QuickAddTagButton onCreate={(name) => createTag.mutateAsync({ name })} creating={createTag.isPending} onCreated={(id) => setTagIds((prev) => [...prev, id])} />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags?.items.length ? (
                tags.items.map((tag) => {
                  const selected = tagIds.includes(tag.id);
                  const color = tag.color;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      style={
                        color
                          ? selected
                            ? { backgroundColor: color, borderColor: color, color: contrastText(color) }
                            : { borderColor: color, color }
                          : undefined
                      }
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-all active:scale-95",
                        !color && (selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"),
                      )}
                    >
                      {tag.name}
                    </button>
                  );
                })
              ) : (
                <span className="text-sm text-muted-foreground">No tags yet.</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trade-notes">Notes</Label>
            <Textarea id="trade-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {mutation.isError ? (
            <p className="text-sm text-destructive">{describeError(mutation.error)}</p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save trade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function QuickAddTagButton({
  onCreate,
  onCreated,
  creating,
}: {
  onCreate: (name: string) => Promise<{ id: string }>;
  onCreated: (id: string) => void;
  creating: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  async function handleCreate() {
    const name = draft.trim();
    if (!name) return;
    const created = await onCreate(name);
    onCreated(created.id);
    setDraft("");
    setAdding(false);
  }

  if (adding) {
    return (
      <div className="flex gap-2">
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="New tag"
          className="h-7 w-28 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleCreate();
            }
            if (e.key === "Escape") setAdding(false);
          }}
        />
        <Button type="button" size="sm" className="h-7 px-2 text-xs" disabled={!draft.trim() || creating} onClick={() => void handleCreate()}>
          Add
        </Button>
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setAdding(true)} className="text-xs font-medium text-primary hover:underline">
      + New
    </button>
  );
}
