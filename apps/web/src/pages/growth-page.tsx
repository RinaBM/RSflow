import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotebookPen, Quote, Shuffle } from "lucide-react";
import type { Trade } from "@rs-flow/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TRADING_QUOTES } from "@/lib/trading-quotes";
import { FUN_COLOR_BORDER_CLASSES, pickFunColor } from "@/lib/fun-colors";
import { useTrades, useUpdateTrade } from "@/features/trades/hooks";

function TradeNoteCard({ trade }: { trade: Trade }) {
  const { t } = useTranslation();
  const update = useUpdateTrade();
  const [notes, setNotes] = useState(trade.lessonsLearned ?? "");
  const [dirty, setDirty] = useState(false);

  function handleSave() {
    update.mutate({ id: trade.id, lessonsLearned: notes || null }, { onSuccess: () => setDirty(false) });
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              trade.side === "LONG"
                ? "border-profit/40 bg-profit/10 text-profit"
                : "border-loss/40 bg-loss/10 text-loss",
            )}
          >
            {trade.side}
          </span>
          <span className="font-medium">{trade.symbol}</span>
        </div>
        <span
          dir="ltr"
          className={cn(
            "font-mono text-sm font-semibold",
            trade.netPnl == null ? "text-muted-foreground" : trade.netPnl >= 0 ? "text-profit" : "text-loss",
          )}
        >
          {trade.netPnl == null ? "—" : formatCurrency(trade.netPnl)}
        </span>
      </div>
      <Textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setDirty(true);
        }}
        placeholder={t("growth.notesPlaceholder")}
        className="min-h-20"
      />
      <div className="flex justify-end">
        <Button type="button" size="sm" variant="outline" disabled={!dirty || update.isPending} onClick={handleSave}>
          {update.isPending ? t("trade.saving") : t("growth.save")}
        </Button>
      </div>
    </div>
  );
}

function randomQuoteIndex(exclude?: number) {
  if (TRADING_QUOTES.length <= 1) return 0;
  let index = Math.floor(Math.random() * TRADING_QUOTES.length);
  while (index === exclude) index = Math.floor(Math.random() * TRADING_QUOTES.length);
  return index;
}

function BigQuoteCard() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(() => randomQuoteIndex());
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pickFunColor() is intentionally random; index is just the recompute trigger
  const funColor = useMemo(() => pickFunColor(), [index]);
  const quote = TRADING_QUOTES[index]!;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border-2 bg-card p-6 sm:flex-row sm:items-center sm:justify-between",
        FUN_COLOR_BORDER_CLASSES[funColor],
      )}
    >
      <div dir="ltr" className="min-w-0 text-start">
        <p className="text-lg font-semibold italic leading-snug text-foreground sm:text-xl">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">— {quote.author}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 self-start sm:self-center"
        onClick={() => setIndex((current) => randomQuoteIndex(current))}
      >
        <Shuffle className="h-3.5 w-3.5" />
        {t("growth.nextQuote")}
      </Button>
    </div>
  );
}

export function GrowthPage() {
  const { t } = useTranslation();
  const { data } = useTrades({ page: 1, pageSize: 10, sort: "entryTime", order: "desc" });
  const trades = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("growth.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("growth.subtitle")}</p>
      </div>

      <div>
        <h2 className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          <NotebookPen className="h-3 w-3" />
          {t("growth.notesHeading")}
        </h2>
        {trades.length === 0 ? (
          <EmptyState icon={NotebookPen} title={t("growth.notesEmpty")} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {trades.map((trade) => (
              <TradeNoteCard key={trade.id} trade={trade} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          <Quote className="h-3 w-3" />
          {t("growth.quotesHeading")}
        </h2>
        <BigQuoteCard />
      </div>
    </div>
  );
}
