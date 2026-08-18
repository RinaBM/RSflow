import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  tone?: "neutral" | "profit" | "loss" | "auto";
  numericValue?: number | null;
  sublabel?: string;
  size?: "default" | "hero";
}

export function StatTile({ label, value, tone = "neutral", numericValue, sublabel, size = "default" }: StatTileProps) {
  const resolvedTone =
    tone === "auto" ? (numericValue == null ? "neutral" : numericValue >= 0 ? "profit" : "loss") : tone;

  return (
    <div className={cn("rounded-lg border border-border bg-card", size === "hero" ? "p-5" : "p-3.5")}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-1.5 font-mono font-semibold tabular-nums",
          size === "hero" ? "text-3xl" : "text-xl",
          resolvedTone === "profit" && "text-profit",
          resolvedTone === "loss" && "text-loss",
        )}
      >
        {value}
      </div>
      {sublabel ? <div className="mt-1 text-xs text-muted-foreground">{sublabel}</div> : null}
    </div>
  );
}
