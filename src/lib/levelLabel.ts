import type { Language } from "../types";

/** HSK's level 7 is officially "7-9" (three combined bands); Spanish's tiers
 * are invented frequency bands with no such external naming convention. */
export function levelLabel(lang: Language, level: number): string {
  if (lang === "zh" && level === 7) return "7–9";
  return String(level);
}
