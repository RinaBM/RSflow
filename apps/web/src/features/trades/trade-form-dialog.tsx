import { useEffect, useState, type FormEvent } from "react";
import type { Trade } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toDatetimeLocalValue } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import { useTradingAccounts } from "@/features/trading-accounts/hooks";
import { useCreateTrade, useUpdateTrade } from "./hooks";

interface TradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade?: Trade;
}

function toDateOrUndefined(localValue: string) {
  return localValue ? new Date(localValue) : undefined;
}

export function TradeFormDialog({ open, onOpenChange, trade }: TradeFormDialogProps) {
  const isEdit = Boolean(trade);
  const { data: accountsData } = useTradingAccounts();
  const create = useCreateTrade();
  const update = useUpdateTrade();

  const [tradingAccountId, setTradingAccountId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"LONG" | "SHORT">("LONG");
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fees, setFees] = useState("0");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setTradingAccountId(trade?.tradingAccountId ?? accountsData?.items[0]?.id ?? "");
    setSymbol(trade?.symbol ?? "");
    setSide(trade?.side ?? "LONG");
    setEntryTime(toDatetimeLocalValue(trade?.entryTime));
    setExitTime(toDatetimeLocalValue(trade?.exitTime));
    setEntryPrice(trade?.entryPrice != null ? String(trade.entryPrice) : "");
    setExitPrice(trade?.exitPrice != null ? String(trade.exitPrice) : "");
    setQuantity(trade?.quantity != null ? String(trade.quantity) : "");
    setFees(trade?.fees != null ? String(trade.fees) : "0");
    setNotes(trade?.notes ?? "");
  }, [open, trade, accountsData]);

  const mutation = isEdit ? update : create;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const input = {
      tradingAccountId,
      symbol,
      side,
      entryTime: toDateOrUndefined(entryTime) as Date,
      exitTime: toDateOrUndefined(exitTime),
      entryPrice: Number(entryPrice),
      exitPrice: exitPrice ? Number(exitPrice) : undefined,
      quantity: Number(quantity),
      fees: Number(fees || 0),
      notes: notes || undefined,
    };

    const onSuccess = () => onOpenChange(false);

    if (isEdit && trade) {
      update.mutate({ id: trade.id, ...input }, { onSuccess });
    } else {
      create.mutate(input, { onSuccess });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit trade" : "New trade"}</DialogTitle>
          <DialogDescription>
            Leave exit time/price empty to log the trade as still open.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-account">Trading account</Label>
              <Select
                id="trade-account"
                required
                value={tradingAccountId}
                onChange={(e) => setTradingAccountId(e.target.value)}
              >
                <option value="" disabled>
                  Select account
                </option>
                {accountsData?.items.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-symbol">Symbol</Label>
              <Input
                id="trade-symbol"
                required
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trade-side">Side</Label>
            <Select id="trade-side" value={side} onChange={(e) => setSide(e.target.value as "LONG" | "SHORT")}>
              <option value="LONG">Long</option>
              <option value="SHORT">Short</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-entry-time">Entry time</Label>
              <Input
                id="trade-entry-time"
                type="datetime-local"
                required
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-exit-time">Exit time</Label>
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
              <Input
                id="trade-entry-price"
                type="number"
                step="0.0001"
                required
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-exit-price">Exit price</Label>
              <Input
                id="trade-exit-price"
                type="number"
                step="0.0001"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-quantity">Quantity</Label>
              <Input
                id="trade-quantity"
                type="number"
                step="0.0001"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="trade-fees">Fees</Label>
              <Input
                id="trade-fees"
                type="number"
                step="0.01"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trade-notes">Notes</Label>
            <Textarea id="trade-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {mutation.isError ? (
            <p className="text-sm text-destructive">
              {mutation.error instanceof ApiError ? mutation.error.message : "Failed to save trade"}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
