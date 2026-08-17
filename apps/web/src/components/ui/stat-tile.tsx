import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  tone?: "neutral" | "profit" | "loss" | "auto";
  numericValue?: number | null;
  sublabel?: string;
}

export function StatTile({ label, value, tone = "neutral", numericValue, sublabel }: StatTileProps) {
  const resolvedTone =
    tone === "auto" ? (numericValue == null ? "neutral" : numericValue >= 0 ? "profit" : "loss") : tone;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-1.5 text-2xl font-semibold",
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
