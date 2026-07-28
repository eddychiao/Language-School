import type { Grade, SrsCard } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const STARTING_EASE = 2.5;
const MIN_EASE = 1.3;
const EASE_UP_STEP = 0.1;
const EASE_DOWN_STEP = 0.2;
const HISTORY_LIMIT = 50;
const FIRST_INTERVAL_DAYS = 1;
const SECOND_INTERVAL_DAYS = 3;

function appendHistory(
  history: SrsCard["history"],
  entry: SrsCard["history"][number],
): SrsCard["history"] {
  return [...history, entry].slice(-HISTORY_LIMIT);
}

/**
 * Simplified SM-2 variant driven by a 3-button grade. `skip` never creates or
 * mutates a card - it's excluded from scheduling entirely, per PLAN.md §5.
 */
export function gradeCard(
  wordId: string,
  existing: SrsCard | undefined,
  grade: Grade,
  now = Date.now(),
): SrsCard | undefined {
  if (grade === "skip") {
    return existing;
  }

  const base: SrsCard = existing ?? {
    wordId,
    reps: 0,
    intervalDays: 0,
    ease: STARTING_EASE,
    dueDate: now,
    lastGrade: grade,
    history: [],
  };

  if (grade === "wrong") {
    return {
      ...base,
      reps: 0,
      intervalDays: 0,
      ease: Math.max(MIN_EASE, base.ease - EASE_DOWN_STEP),
      dueDate: now,
      lastGrade: grade,
      history: appendHistory(base.history, { at: now, grade }),
    };
  }

  const reps = base.reps + 1;
  const ease = base.ease + EASE_UP_STEP;
  const intervalDays =
    reps === 1
      ? FIRST_INTERVAL_DAYS
      : reps === 2
        ? SECOND_INTERVAL_DAYS
        : Math.round(base.intervalDays * ease);

  return {
    ...base,
    reps,
    intervalDays,
    ease,
    dueDate: now + intervalDays * DAY_MS,
    lastGrade: grade,
    history: appendHistory(base.history, { at: now, grade }),
  };
}

/** Never-seen words (no card yet) are always considered due. */
export function isDue(card: SrsCard | undefined, now = Date.now()): boolean {
  if (!card) return true;
  return card.dueDate <= now;
}
