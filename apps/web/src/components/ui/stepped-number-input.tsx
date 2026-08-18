import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SteppedNumberInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  smallStep: number;
  largeStep: number;
  min?: number;
  required?: boolean;
  decimals?: number;
}

function roundTo(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function SteppedNumberInput({
  id,
  value,
  onChange,
  smallStep,
  largeStep,
  min,
  required,
  decimals = 2,
}: SteppedNumberInputProps) {
  function bump(delta: number) {
    const current = Number(value || 0);
    const next = roundTo((Number.isNaN(current) ? 0 : current) + delta, decimals);
    onChange(String(min != null && next < min ? min : next));
  }

  return (
    <div
      dir="ltr"
      className="flex h-9 items-stretch rounded-md border border-input bg-background transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring"
    >
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        min={min}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 flex-1 appearance-none bg-transparent px-3 py-1 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="flex border-l border-input">
        <div className="flex flex-col border-r border-input">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => bump(smallStep)}
            title={`+${smallStep}`}
            className="flex h-1/2 w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-90"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => bump(-smallStep)}
            title={`-${smallStep}`}
            className="flex h-1/2 w-6 items-center justify-center border-t border-input text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-90"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <div className={cn("flex flex-col")}>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => bump(largeStep)}
            title={`+${largeStep}`}
            className="flex h-1/2 w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-90"
          >
            <ChevronsUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => bump(-largeStep)}
            title={`-${largeStep}`}
            className="flex h-1/2 w-6 items-center justify-center border-t border-input text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-90"
          >
            <ChevronsDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
