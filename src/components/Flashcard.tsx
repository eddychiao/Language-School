import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Word } from "../types";
import { posLabel } from "../lib/wordDisplay";
import styles from "./Flashcard.module.css";

interface FlashcardProps {
  word: Word;
  showTraditional?: boolean;
  showPinyin?: boolean;
  /** When true, the meaning/pinyin side shows first and flips to the
   * character - reversing the normal character-first quiz direction. */
  reversed?: boolean;
}

export function Flashcard({
  word,
  showTraditional = false,
  showPinyin = true,
  reversed = false,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [formIndex, setFormIndex] = useState(0);

  useEffect(() => {
    setFlipped(false);
    setFormIndex(0);
  }, [word.id]);

  const toggle = () => setFlipped((f) => !f);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  let headwordContent: ReactNode;
  let meaningContent: ReactNode;

  if (word.lang === "zh") {
    const form = word.forms[formIndex] ?? word.forms[0];

    headwordContent = (
      <>
        <div className={`${styles.hanzi} hanzi`}>{word.simplified}</div>
        {showTraditional && form.traditional && (
          <div className={styles.traditional}>{form.traditional}</div>
        )}
      </>
    );

    meaningContent = (
      <>
        {word.forms.length > 1 && (
          <div className={styles.tabs} role="tablist">
            {word.forms.map((f, i) => (
              <button
                key={`${f.pinyin}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === formIndex}
                className={`${styles.tab} ${i === formIndex ? styles.tabActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setFormIndex(i);
                }}
              >
                {f.pinyin}
              </button>
            ))}
          </div>
        )}
        {showPinyin && <div className={styles.pinyin}>{form.pinyin}</div>}
        <ul className={styles.meanings}>
          {form.meanings.map((meaning) => (
            <li key={meaning}>{meaning}</li>
          ))}
        </ul>
        {word.pos.length > 0 && (
          <div className={styles.pos}>
            {word.pos.map((p) => posLabel(word, p)).join(", ")}
          </div>
        )}
      </>
    );
  } else {
    headwordContent = (
      <>
        <div className={styles.word}>{word.word}</div>
        {word.gender && <div className={styles.gender}>{word.gender}</div>}
      </>
    );

    meaningContent = (
      <>
        <ul className={styles.meanings}>
          {word.meanings.map((meaning) => (
            <li key={meaning}>{meaning}</li>
          ))}
        </ul>
        {word.pos.length > 0 && (
          <div className={styles.pos}>
            {word.pos.map((p) => posLabel(word, p)).join(", ")}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={styles.scene}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <div className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.face}>
          <div className={styles.faceContent}>
            {reversed ? meaningContent : headwordContent}
          </div>
        </div>
        <div className={`${styles.face} ${styles.faceBack}`}>
          <div className={styles.faceContent}>
            {reversed ? headwordContent : meaningContent}
          </div>
        </div>
      </div>
    </div>
  );
}
