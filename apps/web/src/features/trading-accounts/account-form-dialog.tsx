import { useEffect, useState, type FormEvent } from "react";
import type { TradingAccount } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTradingAccount, useUpdateTradingAccount } from "./hooks";

interface AccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: TradingAccount;
}

export function AccountFormDialog({ open, onOpenChange, account }: AccountFormDialogProps) {
  const isEdit = Boolean(account);
  const create = useCreateTradingAccount();
  const update = useUpdateTradingAccount();

  const [name, setName] = useState("");
  const [broker, setBroker] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [startingBalance, setStartingBalance] = useState("0");

  useEffect(() => {
    if (open) {
      setName(account?.name ?? "");
      setBroker(account?.broker ?? "");
      setCurrency(account?.currency ?? "USD");
      setStartingBalance(String(account?.startingBalance ?? 0));
    }
  }, [open, account]);

  const mutation = isEdit ? update : create;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const input = { name, broker, currency, startingBalance: Number(startingBalance) };

    const onSuccess = () => onOpenChange(false);

    if (isEdit && account) {
      update.mutate({ id: account.id, ...input }, { onSuccess });
    } else {
      create.mutate(input, { onSuccess });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit trading account" : "New trading account"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the details of this account." : "Add an account to track trades against."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acc-name">Name</Label>
            <Input id="acc-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acc-broker">Broker</Label>
            <Input
              id="acc-broker"
              required
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              placeholder="e.g. Colmex Pro"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-currency">Currency</Label>
              <Input
                id="acc-currency"
                required
                maxLength={3}
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-balance">Starting balance</Label>
              <Input
                id="acc-balance"
                type="number"
                step="0.01"
                value={startingBalance}
                onChange={(e) => setStartingBalance(e.target.value)}
              />
            </div>
          </div>

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
