import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { useFlashcardNav } from "../lib/useFlashcardNav";
import { resolveWords } from "../lib/words";
import { shuffle } from "../lib/random";
import { FlashcardStage } from "../components/FlashcardStage";
import { ProgressBar } from "../components/ProgressBar";
import { Toggle } from "../components/Toggle";
import { ShuffleIcon } from "../components/Icons";
import type { Word } from "../types";
import styles from "./LessonCards.module.css";

export function LessonCards() {
  const lang = useLang();
  const { planId, lessonId } = useParams();
  const navigate = useNavigate();
  const { data, toggleMemorized, updateSettings } = useStudyStore();

  const plan = data.lessonPlans.find((p) => p.id === planId);
  const lesson = plan?.lessons.find((l) => l.id === lessonId);

  const { words: pool, loading } = useLevelsData(lang, plan?.levels ?? []);
  const resolvedWords = useMemo(
    () => (lesson ? resolveWords(lesson.wordIds, pool) : []),
    [lesson, pool],
  );

  const [reversed, setReversed] = useState(false);
  const [hideMemorized, setHideMemorized] = useState(false);
  const [orderedWords, setOrderedWords] = useState<Word[]>([]);

  useEffect(() => {
    setOrderedWords(resolvedWords);
  }, [resolvedWords]);

  const filtered = useMemo(() => {
    return hideMemorized
      ? orderedWords.filter((w) => !data.memorized[w.id])
      : orderedWords;
  }, [orderedWords, hideMemorized, data.memorized]);

  const { index, direction, goPrev, goNext, resetIndex } = useFlashcardNav(
    filtered.length,
  );

  const memorizedCount = useMemo(
    () => resolvedWords.filter((w) => data.memorized[w.id]).length,
    [resolvedWords, data.memorized],
  );

  const shuffleDeck = () => {
    setOrderedWords((prev) => shuffle(prev));
    resetIndex();
  };

  if (!plan || !lesson) {
    return (
      <div className={styles.page}>
        <p>Lesson not found.</p>
      </div>
    );
  }

  const current = filtered[index];

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1>{lesson.label}</h1>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(`/${lang}/plan`)}
        >
          Back to plans
        </button>
      </div>

      <ProgressBar
        label={`${memorizedCount} / ${resolvedWords.length} memorized`}
        value={resolvedWords.length === 0 ? 0 : memorizedCount / resolvedWords.length}
      />

      <div className={styles.toggles}>
        <button
          type="button"
          className={styles.shuffleButton}
          onClick={shuffleDeck}
        >
          <ShuffleIcon size={16} />
          Shuffle
        </button>
        <Toggle
          checked={reversed}
          onChange={setReversed}
          label="Reversed (meaning first)"
        />
        <Toggle
          checked={hideMemorized}
          onChange={(checked) => {
            setHideMemorized(checked);
            resetIndex();
          }}
          label="Hide memorized"
        />
        {lang === "zh" && (
          <Toggle
            checked={data.settings.showPinyin}
            onChange={(checked) => updateSettings({ showPinyin: checked })}
            label="Show pinyin"
          />
        )}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : !current ? (
        <p>No words match.</p>
      ) : (
        <FlashcardStage
          word={current}
          index={index}
          total={filtered.length}
          direction={direction}
          showTraditional={data.settings.showTraditional}
          showPinyin={data.settings.showPinyin}
          reversed={reversed}
          isMemorized={Boolean(data.memorized[current.id])}
          onToggleMemorized={() => toggleMemorized(current.id)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
