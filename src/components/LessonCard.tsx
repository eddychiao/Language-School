import type { Lesson } from "../types";
import { ProgressBar } from "./ProgressBar";
import styles from "./LessonCard.module.css";

interface LessonCardProps {
  lesson: Lesson;
  total: number;
  memorizedCount: number;
  onStudyFlashcards: () => void;
  onStartTest: () => void;
}

export function LessonCard({
  lesson,
  total,
  memorizedCount,
  onStudyFlashcards,
  onStartTest,
}: LessonCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{lesson.label}</h3>
        <span className={styles.count}>
          {memorizedCount} / {total} memorized
        </span>
      </div>
      <ProgressBar value={total === 0 ? 0 : memorizedCount / total} />
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          onClick={onStudyFlashcards}
        >
          Study as flashcards
        </button>
        <button type="button" className={styles.primary} onClick={onStartTest}>
          Start test session
        </button>
      </div>
    </div>
  );
}
