import type { Grade } from "../types";
import { CheckIcon, SkipIcon, XIcon } from "./Icons";
import styles from "./GradeButtons.module.css";

interface GradeButtonsProps {
  onGrade: (grade: Grade) => void;
  disabled?: boolean;
}

export function GradeButtons({ onGrade, disabled = false }: GradeButtonsProps) {
  return (
    <div className={styles.row}>
      <button
        type="button"
        className={`${styles.button} ${styles.wrong}`}
        onClick={() => onGrade("wrong")}
        disabled={disabled}
      >
        <XIcon size={18} />
        Wrong
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.skip}`}
        onClick={() => onGrade("skip")}
        disabled={disabled}
      >
        <SkipIcon size={18} />
        Skip
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.right}`}
        onClick={() => onGrade("right")}
        disabled={disabled}
      >
        <CheckIcon size={18} />
        Right
      </button>
    </div>
  );
}
