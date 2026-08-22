import { useMemo, useState } from "react";
import { useLang } from "../lib/useLang";
import { Toggle } from "../components/Toggle";
import type { ReadingDifficulty, ReadingPassage } from "../data/readingTypes";
import { READINGS_ZH } from "../data/zh/readings";
import { READINGS_ES } from "../data/es/readings";
import type { Language } from "../types";
import styles from "./Reading.module.css";

const READINGS_BY_LANG: Record<Language, ReadingPassage[]> = {
  zh: READINGS_ZH,
  es: READINGS_ES,
};

const DIFFICULTIES: { value: ReadingDifficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const DIFFICULTY_LABELS: Record<ReadingDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function Reading() {
  const lang = useLang();
  const [filter, setFilter] = useState<ReadingDifficulty | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const readings = READINGS_BY_LANG[lang];
  const passages = useMemo(
    () => (filter ? readings.filter((p) => p.difficulty === filter) : readings),
    [readings, filter],
  );
  const selected = readings.find((p) => p.id === selectedId) ?? null;

  if (selected) {
    return (
      <PassageView passage={selected} lang={lang} onBack={() => setSelectedId(null)} />
    );
  }

  return (
    <div className={styles.page}>
      <h1>Reading practice</h1>
      <p>Short graded passages with translations and comprehension questions.</p>

      <div className={styles.filters} role="group" aria-label="Difficulty">
        <button
          type="button"
          className={`${styles.filterChip} ${filter === null ? styles.filterSelected : ""}`}
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
        >
          All
        </button>
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            type="button"
            className={`${styles.filterChip} ${filter === d.value ? styles.filterSelected : ""}`}
            aria-pressed={filter === d.value}
            onClick={() => setFilter(d.value)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {passages.map((passage) => (
          <button
            key={passage.id}
            type="button"
            className={styles.card}
            onClick={() => setSelectedId(passage.id)}
          >
            <div className={styles.cardHeader}>
              <span className={`${lang === "zh" ? "hanzi " : ""}${styles.cardTitle}`}>
                {passage.title}
              </span>
              <span className={`${styles.badge} ${styles[passage.difficulty]}`}>
                {DIFFICULTY_LABELS[passage.difficulty]}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <span>{passage.titleEn}</span>
              <span>·</span>
              <span>{passage.band}</span>
              <span>·</span>
              <span>
                {lang === "zh"
                  ? `${passage.paragraphs.join("").length} characters`
                  : `${passage.paragraphs.join(" ").split(/\s+/).length} words`}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PassageView({
  passage,
  lang,
  onBack,
}: {
  passage: ReadingPassage;
  lang: Language;
  onBack: () => void;
}) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const langClass = lang === "zh" ? "hanzi " : "";

  const reveal = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← All passages
      </button>

      <div className={styles.passageHeader}>
        <h1 className={langClass}>{passage.title}</h1>
        <div className={styles.cardMeta}>
          <span>{passage.titleEn}</span>
          <span>·</span>
          <span className={`${styles.badge} ${styles[passage.difficulty]}`}>
            {DIFFICULTY_LABELS[passage.difficulty]}
          </span>
          <span>·</span>
          <span>{passage.band}</span>
        </div>
      </div>

      <Toggle
        checked={showTranslation}
        onChange={setShowTranslation}
        label="Show translation"
      />

      <article className={styles.passage}>
        {passage.paragraphs.map((para, i) => (
          <div key={i} className={styles.paragraphBlock}>
            <p className={`${langClass}${styles.paragraph}`}>{para}</p>
            {showTranslation && (
              <p className={styles.translation}>{passage.translation[i]}</p>
            )}
          </div>
        ))}
      </article>

      <section>
        <h2>Questions</h2>
        <div className={styles.questions}>
          {passage.questions.map((question, i) => (
            <div key={i} className={styles.question}>
              <p className={`${langClass}${styles.questionText}`}>{question.q}</p>
              {revealed.has(i) ? (
                <button
                  type="button"
                  className={`${langClass}${styles.answer}`}
                  onClick={() => reveal(i)}
                >
                  {question.a}
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.revealButton}
                  onClick={() => reveal(i)}
                >
                  Show answer
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
