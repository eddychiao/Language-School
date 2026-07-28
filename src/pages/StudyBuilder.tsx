import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { LevelChips } from "../components/LevelChips";
import { Toggle } from "../components/Toggle";
import {
  buildSession,
  matchingCandidates,
  MAX_SESSION_SIZE,
} from "../lib/sessionBuilder";
import { resolveWords } from "../lib/words";
import type { SessionConfig } from "../types";
import styles from "./StudyBuilder.module.css";

interface LessonSeed {
  wordIds: string[];
  levels: number[];
  label: string;
}

export function StudyBuilder() {
  const lang = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, updateSettings } = useStudyStore();

  const allLevels = useMemo(() => levelIndex(lang).map((entry) => entry.level), [lang]);

  const lessonSeed = (location.state as { lesson?: LessonSeed } | null)?.lesson;

  const [levels, setLevels] = useState<number[]>(lessonSeed?.levels ?? [1]);
  const [size, setSize] = useState(() =>
    lessonSeed
      ? Math.max(1, Math.min(lessonSeed.wordIds.length, MAX_SESSION_SIZE))
      : 20,
  );
  const [onlyUnmemorized, setOnlyUnmemorized] = useState(false);
  const [order, setOrder] = useState<SessionConfig["order"]>("due");
  const [reversed, setReversed] = useState(false);

  const { words: loadedPool, loading } = useLevelsData(lang, levels);

  const pool = useMemo(
    () => (lessonSeed ? resolveWords(lessonSeed.wordIds, loadedPool) : loadedPool),
    [lessonSeed, loadedPool],
  );

  const matchCount = useMemo(
    () => matchingCandidates(pool, onlyUnmemorized, data.memorized).length,
    [pool, onlyUnmemorized, data.memorized],
  );

  const start = () => {
    const config: SessionConfig = {
      language: lang,
      levels,
      wordIds: lessonSeed?.wordIds,
      size,
      onlyUnmemorized,
      order,
      reversed,
    };
    const queue = buildSession({
      pool,
      config,
      memorized: data.memorized,
      srs: data.srs,
    });
    navigate(`/${lang}/study/session`, { state: { words: queue, config } });
  };

  return (
    <div className={styles.page}>
      <h1>New test session</h1>

      {lessonSeed ? (
        <p className={styles.lessonLabel}>Lesson: {lessonSeed.label}</p>
      ) : (
        <section>
          <h2 className={styles.sectionTitle}>Levels</h2>
          <LevelChips lang={lang} levels={allLevels} selected={levels} onChange={setLevels} />
        </section>
      )}

      <section>
        <h2 className={styles.sectionTitle}>Size</h2>
        <input
          type="range"
          min={1}
          max={MAX_SESSION_SIZE}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className={styles.range}
        />
        <div className={styles.sizeValue}>{size} cards</div>
      </section>

      <section className={styles.toggleGroup}>
        <Toggle
          checked={onlyUnmemorized}
          onChange={setOnlyUnmemorized}
          label={`Only un-memorized words ${lessonSeed ? "" : "(within selected levels)"}`}
        />
        <Toggle
          checked={reversed}
          onChange={setReversed}
          label="Reversed - show meaning first, flip to the word"
        />
        {lang === "zh" && (
          <Toggle
            checked={data.settings.showPinyin}
            onChange={(checked) => updateSettings({ showPinyin: checked })}
            label="Show pinyin"
          />
        )}
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Order</h2>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as SessionConfig["order"])}
          className={styles.select}
        >
          <option value="due">Due first</option>
          <option value="frequency">Frequency (common first)</option>
          <option value="random">Random</option>
        </select>
      </section>

      <p className={styles.preview}>
        {loading
          ? "Loading…"
          : `${matchCount} words match — sampling ${Math.min(size, matchCount)}`}
      </p>

      <button
        type="button"
        className={styles.startButton}
        disabled={loading || pool.length === 0 || matchCount === 0}
        onClick={start}
      >
        Start
      </button>
    </div>
  );
}
