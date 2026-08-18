import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          <DialogTitle>{isEdit ? t("accountForm.editTitle") : t("accountForm.newTitle")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("accountForm.editDescription") : t("accountForm.newDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acc-name">{t("accountForm.name")}</Label>
            <Input id="acc-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="acc-broker">{t("accountForm.broker")}</Label>
            <Input
              id="acc-broker"
              required
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              placeholder="e.g. Colmex Pro"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-currency">{t("accountForm.currency")}</Label>
              <Input
                id="acc-currency"
                required
                maxLength={3}
                dir="ltr"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="acc-balance">{t("accountForm.startingBalance")}</Label>
              <Input
                id="acc-balance"
                type="number"
                step="0.01"
                dir="ltr"
                value={startingBalance}
                onChange={(e) => setStartingBalance(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("accountForm.cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("accountForm.saving") : t("accountForm.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
