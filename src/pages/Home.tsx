import { Link } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { levelLabel } from "../lib/levelLabel";
import { levelName } from "../lib/levelName";
import { headword } from "../lib/wordDisplay";
import { todayKey } from "../lib/date";
import { ProgressBar } from "../components/ProgressBar";
import { InfoTooltip } from "../components/InfoTooltip";
import styles from "./Home.module.css";

const LANGUAGE_NAMES = { zh: "Chinese", es: "Spanish" } as const;

export function Home() {
  const lang = useLang();
  const { data } = useStudyStore();
  const indexData = levelIndex(lang);
  const allLevels = indexData.map((entry) => entry.level);
  const { words, loading } = useLevelsData(lang, allLevels);

  const memorizedToday = data.stats.daily[todayKey()]?.memorized ?? 0;
  const totalWords = indexData.reduce((sum, entry) => sum + entry.count, 0);

  let memorizedCount = 0;
  const memorizedByLevel = new Map<number, number>();
  const wordsByLevel = new Map<number, string[]>();
  if (!loading) {
    for (const word of words) {
      if (data.memorized[word.id]) {
        memorizedCount++;
        for (const level of word.levels) {
          memorizedByLevel.set(level, (memorizedByLevel.get(level) ?? 0) + 1);
        }
      }
      for (const level of word.levels) {
        const list = wordsByLevel.get(level);
        if (list) list.push(headword(word));
        else wordsByLevel.set(level, [headword(word)]);
      }
    }
  }
  const memorizedPct =
    totalWords === 0 ? 0 : Math.round((memorizedCount / totalWords) * 100);

  return (
    <div className={styles.page}>
      <h1>{LANGUAGE_NAMES[lang]}</h1>

      <div className={styles.summaryRow}>
        <SummaryStat label="Memorized today" value={memorizedToday} />
        <SummaryStat
          label="Memorized"
          value={loading ? "…" : `${memorizedCount} / ${totalWords} · ${memorizedPct}%`}
        />
      </div>

      <div className={styles.actions}>
        <Link to={`/${lang}/study`} className={styles.primaryAction}>
          New test session
        </Link>
        <Link to={`/${lang}/words/1`} className={styles.secondaryAction}>
          Browse words
        </Link>
        <Link to={`/${lang}/plan`} className={styles.secondaryAction}>
          Lesson plans
        </Link>
        <Link to={`/${lang}/reading`} className={styles.secondaryAction}>
          Reading practice
        </Link>
        <Link to={`/${lang}/stats`} className={styles.secondaryAction}>
          Stats
        </Link>
      </div>

      <section>
        <h2>Levels</h2>
        <div className={styles.levels}>
          {indexData.map((entry) => {
            const memorized = memorizedByLevel.get(entry.level) ?? 0;
            const pct =
              entry.count === 0 ? 0 : Math.round((memorized / entry.count) * 100);
            return (
              <div key={entry.level} className={styles.levelRow}>
                <Link to={`/${lang}/words/${entry.level}`} className={styles.levelLink}>
                  <div className={styles.levelHeader}>
                    <span>
                      {levelName(entry.level)}
                      <span className={styles.levelBadge}>
                        Level {levelLabel(lang, entry.level)}
                      </span>
                    </span>
                    <span className={styles.levelCount}>
                      {loading ? "…" : `${memorized} / ${entry.count} · ${pct}%`}
                    </span>
                  </div>
                  <ProgressBar
                    value={loading || entry.count === 0 ? 0 : memorized / entry.count}
                  />
                </Link>
                <InfoTooltip
                  label={`Example words for level ${levelLabel(lang, entry.level)}`}
                  words={wordsByLevel.get(entry.level) ?? []}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
