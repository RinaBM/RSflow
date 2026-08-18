import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useAddAttachment, useDeleteAttachment, useTrade, useUpdateTrade } from "@/features/trades/hooks";
import { strategyHooks } from "@/features/strategies/hooks";
import { setupHooks } from "@/features/setups/hooks";
import { tagHooks } from "@/features/tags/hooks";
import { mistakeCategoryHooks } from "@/features/mistake-categories/hooks";

function formatCurrency(value: number | null) {
  if (value == null) return "—";
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export function TradeReviewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const tradeId = id as string;

  const { data, isLoading, isError, error } = useTrade(tradeId);
  const updateTrade = useUpdateTrade();
  const addAttachment = useAddAttachment(tradeId);
  const deleteAttachment = useDeleteAttachment(tradeId);

  const { data: strategies } = strategyHooks.useList();
  const { data: setups } = setupHooks.useList();
  const { data: tags } = tagHooks.useList();
  const { data: mistakeCategories } = mistakeCategoryHooks.useList();

  const trade = data?.trade;

  const [strategyId, setStrategyId] = useState("");
  const [setupId, setSetupId] = useState("");
  const [entryReason, setEntryReason] = useState("");
  const [tradingPlan, setTradingPlan] = useState("");
  const [followedPlan, setFollowedPlan] = useState<"" | "yes" | "no">("");
  const [whatWentWell, setWhatWentWell] = useState("");
  const [mistakesNotes, setMistakesNotes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [emotionalState, setEmotionalState] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedMistakeIds, setSelectedMistakeIds] = useState<string[]>([]);

  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentType, setAttachmentType] = useState<"BEFORE" | "AFTER">("BEFORE");
  const [attachmentCaption, setAttachmentCaption] = useState("");

  useEffect(() => {
    if (!trade) return;
    setStrategyId(trade.strategyId ?? "");
    setSetupId(trade.setupId ?? "");
    setEntryReason(trade.entryReason ?? "");
    setTradingPlan(trade.tradingPlan ?? "");
    setFollowedPlan(trade.followedPlan == null ? "" : trade.followedPlan ? "yes" : "no");
    setWhatWentWell(trade.whatWentWell ?? "");
    setMistakesNotes(trade.mistakesNotes ?? "");
    setLessonsLearned(trade.lessonsLearned ?? "");
    setEmotionalState(trade.emotionalState ?? "");
    setNotes(trade.notes ?? "");
    setSelectedTagIds(trade.tags.map((t) => t.id));
    setSelectedMistakeIds(trade.mistakeCategories.map((m) => m.id));
  }, [trade]);

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  }

  function toggleMistake(mistakeId: string) {
    setSelectedMistakeIds((prev) =>
      prev.includes(mistakeId) ? prev.filter((m) => m !== mistakeId) : [...prev, mistakeId],
    );
  }

  function handleSaveReview(e: FormEvent) {
    e.preventDefault();
    updateTrade.mutate({
      id: tradeId,
      strategyId: strategyId || null,
      setupId: setupId || null,
      entryReason: entryReason || null,
      tradingPlan: tradingPlan || null,
      followedPlan: followedPlan === "" ? null : followedPlan === "yes",
      whatWentWell: whatWentWell || null,
      mistakesNotes: mistakesNotes || null,
      lessonsLearned: lessonsLearned || null,
      emotionalState: emotionalState || null,
      notes: notes || null,
      tagIds: selectedTagIds,
      mistakeCategoryIds: selectedMistakeIds,
    });
  }

  function handleAddAttachment(e: FormEvent) {
    e.preventDefault();
    addAttachment.mutate(
      { url: attachmentUrl, type: attachmentType, caption: attachmentCaption || undefined },
      {
        onSuccess: () => {
          setAttachmentUrl("");
          setAttachmentCaption("");
        },
        onError: (err) => window.alert(err instanceof ApiError ? err.message : t("tradeReview.addFailed")),
      },
    );
  }

  function handleDeleteAttachment(attachmentId: string) {
    if (!window.confirm(t("tradeReview.removeConfirm"))) return;
    deleteAttachment.mutate(attachmentId);
  }

  if (isLoading) {
    return <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">{t("tradeReview.loading")}</div>;
  }

  if (isError || !trade) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-destructive">
        {error instanceof ApiError ? error.message : t("tradeReview.notFound")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/journal" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("tradeReview.backToJournal")}
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {trade.symbol} · {trade.side}
          </h1>
          <span dir="ltr" className={cn("text-lg font-semibold", (trade.netPnl ?? 0) >= 0 ? "text-profit" : "text-loss")}>
            {formatCurrency(trade.netPnl)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground" dir="ltr">
          {formatDateTime(trade.entryTime)} → {formatDateTime(trade.exitTime)}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("tradeReview.review")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveReview} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-strategy">{t("tradeReview.strategy")}</Label>
                <Select id="review-strategy" value={strategyId} onChange={(e) => setStrategyId(e.target.value)}>
                  <option value="">{t("tradeReview.none")}</option>
                  {strategies?.items.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="review-setup">{t("tradeReview.setup")}</Label>
                <Select id="review-setup" value={setupId} onChange={(e) => setSetupId(e.target.value)}>
                  <option value="">{t("tradeReview.none")}</option>
                  {setups?.items.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("tradeReview.tags")}</Label>
              <div className="flex flex-wrap gap-2">
                {tags?.items.length ? (
                  tags.items.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        selectedTagIds.includes(tag.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tag.name}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t("tradeReview.noTagsYet")}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-entry-reason">{t("tradeReview.whyEnter")}</Label>
              <Textarea id="review-entry-reason" value={entryReason} onChange={(e) => setEntryReason(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-trading-plan">{t("tradeReview.tradingPlan")}</Label>
              <Textarea id="review-trading-plan" value={tradingPlan} onChange={(e) => setTradingPlan(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-followed-plan">{t("tradeReview.followedPlan")}</Label>
              <Select
                id="review-followed-plan"
                value={followedPlan}
                onChange={(e) => setFollowedPlan(e.target.value as "" | "yes" | "no")}
              >
                <option value="">{t("tradeReview.notSpecified")}</option>
                <option value="yes">{t("tradeReview.yes")}</option>
                <option value="no">{t("tradeReview.no")}</option>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-what-went-well">{t("tradeReview.whatWentWell")}</Label>
              <Textarea id="review-what-went-well" value={whatWentWell} onChange={(e) => setWhatWentWell(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("tradeReview.mistakes")}</Label>
              <div className="flex flex-wrap gap-2">
                {mistakeCategories?.items.length ? (
                  mistakeCategories.items.map((mistake) => (
                    <button
                      key={mistake.id}
                      type="button"
                      onClick={() => toggleMistake(mistake.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        selectedMistakeIds.includes(mistake.id)
                          ? "border-loss bg-loss/15 text-loss"
                          : "border-border bg-background text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {mistake.name}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t("tradeReview.noMistakesYet")}</span>
                )}
              </div>
              <Textarea
                placeholder={t("tradeReview.mistakesNotesPlaceholder")}
                value={mistakesNotes}
                onChange={(e) => setMistakesNotes(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-lessons">{t("tradeReview.lessonsLearned")}</Label>
              <Textarea id="review-lessons" value={lessonsLearned} onChange={(e) => setLessonsLearned(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-emotional-state">{t("tradeReview.emotionalState")}</Label>
              <Input
                id="review-emotional-state"
                value={emotionalState}
                onChange={(e) => setEmotionalState(e.target.value)}
                placeholder={t("tradeReview.emotionalStatePlaceholder")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-notes">{t("tradeReview.notes")}</Label>
              <Textarea id="review-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {updateTrade.isError ? (
              <p className="text-sm text-destructive">
                {updateTrade.error instanceof ApiError ? updateTrade.error.message : t("tradeReview.saveFailed")}
              </p>
            ) : null}

            <div>
              <Button type="submit" disabled={updateTrade.isPending}>
                {updateTrade.isPending ? t("tradeReview.saving") : t("tradeReview.saveReview")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("tradeReview.screenshots")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {trade.attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("tradeReview.noScreenshots")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {trade.attachments.map((attachment) => (
                <div key={attachment.id} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <img
                    src={attachment.url}
                    alt={attachment.caption ?? `${attachment.type} screenshot`}
                    className="max-h-48 w-full rounded-md object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {attachment.type}
                      {attachment.caption ? ` · ${attachment.caption}` : ""}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAttachment(attachment.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddAttachment} className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-48 flex-1 flex-col gap-1.5">
              <Label htmlFor="attachment-url">{t("tradeReview.screenshotUrl")}</Label>
              <Input
                id="attachment-url"
                type="url"
                required
                dir="ltr"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="attachment-type">{t("tradeReview.type")}</Label>
              <Select
                id="attachment-type"
                value={attachmentType}
                onChange={(e) => setAttachmentType(e.target.value as "BEFORE" | "AFTER")}
              >
                <option value="BEFORE">{t("tradeReview.before")}</option>
                <option value="AFTER">{t("tradeReview.after")}</option>
              </Select>
            </div>
            <div className="flex min-w-40 flex-col gap-1.5">
              <Label htmlFor="attachment-caption">{t("tradeReview.caption")}</Label>
              <Input
                id="attachment-caption"
                value={attachmentCaption}
                onChange={(e) => setAttachmentCaption(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={addAttachment.isPending}>
              <Plus className="h-4 w-4" />
              {t("tradeReview.add")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
