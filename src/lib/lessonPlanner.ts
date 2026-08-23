import type { Language, Lesson, LessonPlan, Word } from "../types";
import { shuffle } from "./random";
import { alphaKey } from "./wordDisplay";

function orderWords(words: Word[], order: LessonPlan["order"]): Word[] {
  switch (order) {
    case "alphabetical":
      return [...words].sort((a, b) => alphaKey(a).localeCompare(alphaKey(b)));
    case "random":
      return shuffle(words);
    case "frequency":
    default:
      return [...words].sort((a, b) => a.frequency - b.frequency);
  }
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface BuildLessonPlanArgs {
  name: string;
  language: Language;
  levels: number[];
  words: Word[];
  order: LessonPlan["order"];
  /** Exactly one of setSize / lessonCount should be given; the other is derived. */
  setSize?: number;
  lessonCount?: number;
}

/** Splits a word pool into a sequence of fixed-size, ordered lessons, per
 * PLAN.md §6a. The split is computed once and returned as a persistable plan. */
export function buildLessonPlan({
  name,
  language,
  levels,
  words,
  order,
  setSize,
  lessonCount,
}: BuildLessonPlanArgs): LessonPlan {
  const ordered = orderWords(words, order);
  const size = Math.max(
    1,
    setSize ?? Math.ceil(ordered.length / Math.max(1, lessonCount ?? 1)),
  );

  const lessons: Lesson[] = [];
  for (let i = 0, lessonNum = 1; i < ordered.length; i += size, lessonNum++) {
    const slice = ordered.slice(i, i + size);
    lessons.push({
      id: randomId("lesson"),
      label: `Lesson ${lessonNum}`,
      wordIds: slice.map((w) => w.id),
    });
  }

  return {
    id: randomId("plan"),
    name,
    language,
    levels,
    order,
    lessons,
    createdAt: Date.now(),
  };
}
