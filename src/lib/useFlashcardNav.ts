import { useEffect, useState } from "react";

export type NavDirection = "left" | "right";

/** Shared prev/next/keyboard-arrow navigation for a flashcard browsing
 * queue of length `total`. Tracks which direction the most recent move was
 * in (for the slide-in animation) and clamps the index whenever `total`
 * shrinks (e.g. a filter removes cards). */
export function useFlashcardNav(total: number) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<NavDirection>("right");

  const goPrev = () => {
    setDirection("left");
    setIndex((i) => Math.max(0, i - 1));
  };
  const goNext = () => {
    setDirection("right");
    setIndex((i) => Math.min(total - 1, i + 1));
  };
  const resetIndex = () => setIndex(0);
  const goToIndex = (i: number) => setIndex(Math.max(0, Math.min(total - 1, i)));

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const clampedIndex = Math.min(index, Math.max(0, total - 1));

  return { index: clampedIndex, direction, goPrev, goNext, resetIndex, goToIndex };
}
