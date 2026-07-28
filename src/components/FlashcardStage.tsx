import type { Word } from "../types";
import { Flashcard } from "./Flashcard";
import { MemorizedCheckbox } from "./MemorizedCheckbox";
import type { NavDirection } from "../lib/useFlashcardNav";
import styles from "./FlashcardStage.module.css";

interface FlashcardStageProps {
  word: Word;
  index: number;
  total: number;
  direction: NavDirection;
  showTraditional: boolean;
  showPinyin: boolean;
  reversed: boolean;
  isMemorized: boolean;
  onToggleMemorized: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** The card + memorized toggle + prev/next nav shared by every flashcard
 * browsing view (Words, Lesson). Purely presentational - filtering,
 * ordering, and index/direction state all live in the caller (via
 * useFlashcardNav) since each view's data pipeline differs. */
export function FlashcardStage({
  word,
  index,
  total,
  direction,
  showTraditional,
  showPinyin,
  reversed,
  isMemorized,
  onToggleMemorized,
  onPrev,
  onNext,
}: FlashcardStageProps) {
  return (
    <div className={styles.cardArea}>
      <p className={styles.progress}>
        {index + 1} / {total}
      </p>
      <div
        key={word.id}
        className={`${styles.cardWrapper} ${
          direction === "left" ? styles.slideLeft : styles.slideRight
        }`}
      >
        <Flashcard
          word={word}
          showTraditional={showTraditional}
          showPinyin={showPinyin}
          reversed={reversed}
        />
      </div>
      <div className={styles.cardActions}>
        <MemorizedCheckbox checked={isMemorized} onToggle={onToggleMemorized} />
      </div>
      <div className={styles.nav}>
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className={styles.navButton}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          className={styles.navButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
