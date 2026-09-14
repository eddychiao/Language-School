import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { matchesQuery } from "../lib/wordDisplay";
import { LevelChips } from "../components/LevelChips";
import { WordTable } from "../components/WordTable";
import { ProgressBar } from "../components/ProgressBar";
import { Toggle } from "../components/Toggle";
import { CardsIcon, SearchIcon } from "../components/Icons";
import styles from "./WordsList.module.css";

export function WordsList() {
  const lang = useLang();
  const { level: levelParam } = useParams();
  const navigate = useNavigate();
  const level = Number(levelParam) || 1;
  const { data, toggleMemorized, updateSettings } = useStudyStore();
  const { words, loading } = useLevelData(lang, level);
  const [query, setQuery] = useState("");
  const hideMemorized = data.settings.hideMemorized;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const allLevels = useMemo(() => levelIndex(lang).map((entry) => entry.level), [lang]);

  const openFlashcard = (id: string) => {
    navigate(`/${lang}/words/${level}/cards?word=${encodeURIComponent(id)}`);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!words) return [];
    const q = query.trim().toLowerCase();
    return words.filter((w) => {
      if (hideMemorized && data.memorized[w.id]) return false;
      return matchesQuery(w, q);
    });
  }, [words, query, hideMemorized, data.memorized]);

  const memorizedInLevel = useMemo(() => {
    if (!words) return 0;
    return words.filter((w) => data.memorized[w.id]).length;
  }, [words, data.memorized]);

  const memorizedPct =
    !words || words.length === 0
      ? 0
      : Math.round((memorizedInLevel / words.length) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1>Words</h1>
        <button
          type="button"
          className={styles.viewSwitch}
          onClick={() => navigate(`/${lang}/words/${level}/cards`)}
        >
          <CardsIcon size={16} />
          Flashcard view
        </button>
      </div>

      <LevelChips
        lang={lang}
        levels={allLevels}
        selected={[level]}
        multi={false}
        onChange={(ls) => navigate(`/${lang}/words/${ls[0]}`)}
      />

      {words && (
        <ProgressBar
          label={`${memorizedInLevel} / ${words.length} · ${memorizedPct}% memorized`}
          value={words.length === 0 ? 0 : memorizedInLevel / words.length}
        />
      )}

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <SearchIcon size={16} />
          <input
            type="search"
            placeholder={lang === "zh" ? "Search word, pinyin, or meaning" : "Search word or meaning"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
          />
        </div>
        <Toggle
          checked={hideMemorized}
          onChange={(checked) => updateSettings({ hideMemorized: checked })}
          label="Hide memorized"
        />
      </div>

      {loading || !words ? (
        <p>Loading…</p>
      ) : (
        <>
          <p className={styles.count}>{filtered.length} words</p>
          <WordTable
            lang={lang}
            words={filtered}
            showTraditional={data.settings.showTraditional}
            isMemorized={(id) => Boolean(data.memorized[id])}
            onToggleMemorized={toggleMemorized}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            onRowClick={openFlashcard}
          />
        </>
      )}
    </div>
  );
}
