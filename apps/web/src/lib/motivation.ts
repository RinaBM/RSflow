/** Picks one templated message from the pool and fills in the trader's name. */
export function pickMotivation(pool: string[], name: string): string {
  if (pool.length === 0) return "";
  const index = Math.floor(Math.random() * pool.length);
  return pool[index]!.replaceAll("{{name}}", name);
}
