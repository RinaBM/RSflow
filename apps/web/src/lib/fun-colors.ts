export const FUN_COLORS = ["fun-1", "fun-2", "fun-3", "fun-4", "fun-5"] as const;
export type FunColor = (typeof FUN_COLORS)[number];

// Written out in full (not template-interpolated) so Tailwind's static scanner picks them up.
export const FUN_COLOR_BADGE_CLASSES: Record<FunColor, string> = {
  "fun-1": "bg-fun-1/15 text-fun-1",
  "fun-2": "bg-fun-2/15 text-fun-2",
  "fun-3": "bg-fun-3/15 text-fun-3",
  "fun-4": "bg-fun-4/15 text-fun-4",
  "fun-5": "bg-fun-5/15 text-fun-5",
};

export const FUN_COLOR_BORDER_CLASSES: Record<FunColor, string> = {
  "fun-1": "border-fun-1/40",
  "fun-2": "border-fun-2/40",
  "fun-3": "border-fun-3/40",
  "fun-4": "border-fun-4/40",
  "fun-5": "border-fun-5/40",
};

export function pickFunColor(): FunColor {
  return FUN_COLORS[Math.floor(Math.random() * FUN_COLORS.length)]!;
}
