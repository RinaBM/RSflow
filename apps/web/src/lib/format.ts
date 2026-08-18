export function formatCurrency(value: number | null) {
  if (value == null) return "—";
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function formatPercent(value: number | null) {
  if (value == null) return "—";
  return `${value.toFixed(1)}%`;
}

export function formatHoldingTime(minutes: number | null) {
  if (minutes == null) return "—";
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
