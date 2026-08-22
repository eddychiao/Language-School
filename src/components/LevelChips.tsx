import type { Language } from "../types";
import { levelLabel } from "../lib/levelLabel";
import { levelName } from "../lib/levelName";
import styles from "./LevelChips.module.css";

interface LevelChipsProps {
  lang: Language;
  levels: number[];
  selected: number[];
  onChange: (levels: number[]) => void;
  multi?: boolean;
  counts?: Partial<Record<number, number>>;
}

export function LevelChips({
  lang,
  levels,
  selected,
  onChange,
  multi = true,
  counts,
}: LevelChipsProps) {
  const toggle = (level: number) => {
    if (!multi) {
      onChange([level]);
      return;
    }
    onChange(
      selected.includes(level)
        ? selected.filter((l) => l !== level)
        : [...selected, level].sort((a, b) => a - b),
    );
  };

  return (
    <div className={styles.row} role="group" aria-label="Level">
      {levels.map((level) => {
        const isSelected = selected.includes(level);
        return (
          <button
            key={level}
            type="button"
            className={`${styles.chip} ${isSelected ? styles.selected : ""}`}
            aria-pressed={isSelected}
            title={levelName(level)}
            onClick={() => toggle(level)}
          >
            <span>{levelLabel(lang, level)}</span>
            {counts?.[level] !== undefined && (
              <span className={styles.count}>{counts[level]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
