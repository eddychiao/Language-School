import type { Language } from "../types";

export function levelLabel(_lang: Language, level: number): string {
  return String(level);
}
