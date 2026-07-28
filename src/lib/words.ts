import type { Word } from "../types";

/** Resolves an ordered list of word IDs back to Word objects from a loaded pool. */
export function resolveWords(wordIds: string[], pool: Word[]): Word[] {
  const byId = new Map(pool.map((w) => [w.id, w] as const));
  return wordIds
    .map((id) => byId.get(id))
    .filter((w): w is Word => w !== undefined);
}
