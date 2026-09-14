import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { useFlashcardNav } from "../lib/useFlashcardNav";
import { shuffle } from "../lib/random";
import { LevelChips } from "../components/LevelChips";
import { FlashcardStage } from "../components/FlashcardStage";
import { ProgressBar } from "../components/ProgressBar";
import { Toggle } from "../components/Toggle";
import { ListIcon, ShuffleIcon } from "../components/Icons";
import type { Word } from "../types";
import styles from "./WordsCards.module.css";

export function WordsCards() {
  const lang = useLang();
  const { level: levelParam } = useParams();
  const navigate = useNavigate();
  const level = Number(levelParam) || 1;
  const { data, toggleMemorized, updateSettings } = useStudyStore();
  const { words, loading } = useLevelData(lang, level);
  const [searchParams] = useSearchParams();
  const initialWordId = searchParams.get("word");
  const appliedInitialWordRef = useRef(false);
  const hideMemorized = data.settings.hideMemorized;
  const [reversed, setReversed] = useState(false);
  const [orderedWords, setOrderedWords] = useState<Word[]>([]);

  const allLevels = useMemo(() => levelIndex(lang).map((entry) => entry.level), [lang]);

  useEffect(() => {
    setOrderedWords(words ?? []);
  }, [words]);

  const filtered = useMemo(() => {
    return hideMemorized
      ? orderedWords.filter((w) => !data.memorized[w.id])
      : orderedWords;
  }, [orderedWords, hideMemorized, data.memorized]);

  const { index, direction, goPrev, goNext, resetIndex, goToIndex } = useFlashcardNav(
    filtered.length,
  );
  const current = filtered[index];

  useEffect(() => {
    if (appliedInitialWordRef.current || !initialWordId || filtered.length === 0) return;
    const wordIndex = filtered.findIndex((w) => w.id === initialWordId);
    if (wordIndex >= 0) {
      goToIndex(wordIndex);
      appliedInitialWordRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, initialWordId]);

  const memorizedInLevel = useMemo(() => {
    if (!words) return 0;
    return words.filter((w) => data.memorized[w.id]).length;
  }, [words, data.memorized]);

  const memorizedPct =
    !words || words.length === 0
      ? 0
      : Math.round((memorizedInLevel / words.length) * 100);

  const shuffleDeck = () => {
    setOrderedWords((prev) => shuffle(prev));
    resetIndex();
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1>Words</h1>
        <button
          type="button"
          className={styles.viewSwitch}
          onClick={() => navigate(`/${lang}/words/${level}`)}
        >
          <ListIcon size={16} />
          List view
        </button>
      </div>

      <LevelChips
        lang={lang}
        levels={allLevels}
        selected={[level]}
        multi={false}
        onChange={(ls) => {
          navigate(`/${lang}/words/${ls[0]}/cards`);
          resetIndex();
        }}
      />

      {words && (
        <ProgressBar
          label={`${memorizedInLevel} / ${words.length} · ${memorizedPct}% memorized`}
          value={words.length === 0 ? 0 : memorizedInLevel / words.length}
        />
      )}

      <div className={styles.toggles}>
        <Toggle
          checked={hideMemorized}
          onChange={(checked) => {
            updateSettings({ hideMemorized: checked });
            resetIndex();
          }}
          label="Hide memorized"
        />
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
        {lang === "zh" && (
          <Toggle
            checked={data.settings.showPinyin}
            onChange={(checked) => updateSettings({ showPinyin: checked })}
            label="Show pinyin"
          />
        )}
      </div>

      {loading || !words ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
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
