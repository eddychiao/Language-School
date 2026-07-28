import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLang } from "../lib/useLang";
import { headword } from "../lib/wordDisplay";
import { Flashcard } from "../components/Flashcard";
import { GradeButtons } from "../components/GradeButtons";
import { MemorizedCheckbox } from "../components/MemorizedCheckbox";
import type { Grade, SessionConfig, SessionRecord, Word } from "../types";
import styles from "./StudySession.module.css";

interface LocationState {
  words: Word[];
  config: SessionConfig;
}

export function StudySession() {
  const lang = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, gradeWord, toggleMemorized, recordSession } = useStudyStore();

  const state = location.state as LocationState | null;
  const words = state?.words ?? [];
  const config = state?.config;

  const [index, setIndex] = useState(0);
  const [tally, setTally] = useState({ right: 0, wrong: 0, skipped: 0 });
  const [missed, setMissed] = useState<Word[]>([]);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!state) {
      navigate(`/${lang}/study`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Reset local session state whenever a fresh word queue arrives (new session,
  // or "study missed again" navigating to this same route with new state).
  useEffect(() => {
    setIndex(0);
    setTally({ right: 0, wrong: 0, skipped: 0 });
    setMissed([]);
    setFinished(false);
    startedAt.current = Date.now();
  }, [state?.words]);

  const current = words[index];

  const handleGrade = (grade: Grade) => {
    if (!current || !config) return;
    gradeWord(current.id, grade);

    const nextTally = {
      right: tally.right + (grade === "right" ? 1 : 0),
      wrong: tally.wrong + (grade === "wrong" ? 1 : 0),
      skipped: tally.skipped + (grade === "skip" ? 1 : 0),
    };
    setTally(nextTally);

    const nextMissed = grade === "wrong" ? [...missed, current] : missed;
    if (grade === "wrong") setMissed(nextMissed);

    if (index + 1 >= words.length) {
      const record: SessionRecord = {
        at: startedAt.current,
        config,
        right: nextTally.right,
        wrong: nextTally.wrong,
        skipped: nextTally.skipped,
        durationMs: Date.now() - startedAt.current,
        wordIds: words.map((w) => w.id),
      };
      recordSession(record);
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  useEffect(() => {
    if (!state || finished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1" || e.key === "ArrowLeft") handleGrade("wrong");
      else if (e.key === "2" || e.key === "ArrowDown") handleGrade("skip");
      else if (e.key === "3" || e.key === "ArrowRight") handleGrade("right");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!state) return null;

  if (finished) {
    return (
      <div className={styles.summary}>
        <h1>Session complete</h1>
        <div className={styles.summaryStats}>
          <SummaryStat label="Right" value={tally.right} colorClass={styles.right} />
          <SummaryStat label="Wrong" value={tally.wrong} colorClass={styles.wrong} />
          <SummaryStat label="Skipped" value={tally.skipped} colorClass={styles.skip} />
        </div>
        {missed.length > 0 && (
          <div className={styles.missedSection}>
            <h2>Missed words</h2>
            <ul className={styles.missedList}>
              {missed.map((w) => (
                <li key={w.id}>
                  <span className={w.lang === "zh" ? "hanzi" : undefined}>
                    {headword(w)}
                  </span>{" "}
                  — {w.lang === "zh" ? `${w.pinyin} — ` : ""}
                  {w.meanings[0]}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.retryButton}
              onClick={() =>
                navigate(`/${lang}/study/session`, {
                  replace: true,
                  state: { words: missed, config },
                })
              }
            >
              Study missed again
            </button>
          </div>
        )}
        <Link to={`/${lang}`} className={styles.homeLink}>
          Back home
        </Link>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className={styles.page}>
      <p className={styles.progress}>
        {index + 1} / {words.length}
      </p>
      <div key={current.id} className={styles.cardWrapper}>
        <Flashcard
          word={current}
          showTraditional={data.settings.showTraditional}
          showPinyin={data.settings.showPinyin}
          reversed={config?.reversed}
        />
      </div>
      <div className={styles.memorizedRow}>
        <MemorizedCheckbox
          checked={Boolean(data.memorized[current.id])}
          onToggle={() => toggleMemorized(current.id)}
        />
      </div>
      <div className={styles.gradeWrapper}>
        <GradeButtons onGrade={handleGrade} />
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className={`${styles.stat} ${colorClass}`}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
