import type { Word } from "../types";
import { posLabel as posLabelZh } from "../data/pos-labels";
import { posLabelEs } from "../data/pos-labels-es";

/** The word/character as shown on flashcards, tables, and lesson labels. */
export function headword(word: Word): string {
  return word.lang === "zh" ? word.simplified : word.word;
}

/** Strips pinyin tone marks (and the umlaut on ü) via Unicode decomposition,
 * so "tong" can match "tòng"/"tóng"/"tōng" etc. without the caller needing
 * to type diacritics. */
export function stripTones(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Case-insensitive, tone-agnostic match against the headword, (for zh)
 * pinyin across all readings, and meanings - used by the Words list search
 * box. `query` should already be trimmed/lowercased. */
export function matchesQuery(word: Word, query: string): boolean {
  if (!query) return true;
  if (headword(word).toLowerCase().includes(query)) return true;
  if (word.lang === "zh") {
    const tonelessQuery = stripTones(query);
    const readings = [word.pinyin, ...word.forms.map((f) => f.pinyin)];
    if (
      readings.some((p) => {
        const lower = p.toLowerCase();
        return lower.includes(query) || stripTones(lower).includes(tonelessQuery);
      })
    ) {
      return true;
    }
  }
  return word.meanings.some((m) => m.toLowerCase().includes(query));
}

/** Alphabetical sort key for the "Alphabetical" lesson-plan order: pinyin for
 * zh (matches how learners think of ordering by reading), the word itself for es. */
export function alphaKey(word: Word): string {
  return word.lang === "zh" ? word.pinyin : word.word;
}

/** Human-readable label for a POS code, using the right language's tag map. */
export function posLabel(word: Word, code: string): string {
  return word.lang === "zh" ? posLabelZh(code) : posLabelEs(code);
}
