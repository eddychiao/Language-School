import type { SessionConfig, SrsCard, Word } from "../types";
import { isDue } from "../srs/scheduler";
import { shuffle } from "./random";

export const MAX_SESSION_SIZE = 100;

/** Filters `pool` down to the candidates a session config would draw from,
 * without ordering or slicing to size - used for the builder's live count preview. */
export function matchingCandidates(
  pool: Word[],
  onlyUnmemorized: boolean,
  memorized: Record<string, true>,
): Word[] {
  if (!onlyUnmemorized) return pool;
  return pool.filter((w) => !memorized[w.id]);
}

function orderCandidates(
  words: Word[],
  order: SessionConfig["order"],
  srs: Record<string, SrsCard>,
  now: number,
): Word[] {
  switch (order) {
    case "frequency":
      return [...words].sort((a, b) => a.frequency - b.frequency);
    case "random":
      return shuffle(words);
    case "due":
    default:
      return [...words].sort((a, b) => {
        const aDue = isDue(srs[a.id], now);
        const bDue = isDue(srs[b.id], now);
        if (aDue !== bDue) return aDue ? -1 : 1;
        const aDate = srs[a.id]?.dueDate ?? 0;
        const bDate = srs[b.id]?.dueDate ?? 0;
        return aDate - bDate;
      });
  }
}

interface BuildSessionArgs {
  pool: Word[];
  config: SessionConfig;
  memorized: Record<string, true>;
  srs: Record<string, SrsCard>;
  now?: number;
}

/** Builds the ordered flashcard queue for a Test Session from a config, per
 * PLAN.md §4/§6: filters to un-memorized within the pool if requested, orders,
 * then clamps to the 1-100 session size. */
export function buildSession({
  pool,
  config,
  memorized,
  srs,
  now = Date.now(),
}: BuildSessionArgs): Word[] {
  const candidates = matchingCandidates(pool, config.onlyUnmemorized, memorized);
  const ordered = orderCandidates(candidates, config.order, srs, now);
  const size = Math.max(1, Math.min(MAX_SESSION_SIZE, config.size));
  return ordered.slice(0, size);
}
