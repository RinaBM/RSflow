import { useState } from "react";
import { Plus, Pencil, Trash2, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TradingAccount } from "@rs-flow/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api-client";
import { useDeleteTradingAccount, useTradingAccounts } from "@/features/trading-accounts/hooks";
import { AccountFormDialog } from "@/features/trading-accounts/account-form-dialog";

export function TradingAccountsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useTradingAccounts();
  const deleteAccount = useDeleteTradingAccount();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TradingAccount | undefined>(undefined);

  function openCreateDialog() {
    setEditingAccount(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(account: TradingAccount) {
    setEditingAccount(account);
    setDialogOpen(true);
  }

  function handleDelete(account: TradingAccount) {
    if (!window.confirm(t("tradingAccountsPage.deleteConfirm", { name: account.name }))) return;
    deleteAccount.mutate(account.id, {
      onError: (err) => {
        window.alert(err instanceof ApiError ? err.message : t("tradingAccountsPage.deleteFailed"));
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("tradingAccountsPage.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("tradingAccountsPage.subtitle")}</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          {t("tradingAccountsPage.newAccount")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t("tradingAccountsPage.loading")}
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : t("tradingAccountsPage.loadFailed")}
        </div>
      ) : data?.items.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={t("tradingAccountsPage.emptyTitle")}
          description={t("tradingAccountsPage.emptyDescription")}
          action={
            <Button variant="outline" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              {t("tradingAccountsPage.createFirst")}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((account) => (
            <Card key={account.id}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{account.name}</div>
                    <div className="text-sm text-muted-foreground">{account.broker}</div>
                  </div>
                  {!account.isActive ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {t("tradingAccountsPage.inactive")}
                    </span>
                  ) : null}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("tradingAccountsPage.startingBalance")}:{" "}
                  <span dir="ltr">
                    {account.startingBalance.toLocaleString()} {account.currency}
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(account)}>
                    <Pencil className="h-3.5 w-3.5" />
                    {t("tradingAccountsPage.edit")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(account)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("tradingAccountsPage.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AccountFormDialog open={dialogOpen} onOpenChange={setDialogOpen} account={editingAccount} />
    </div>
  );
}
