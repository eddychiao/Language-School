import { Link } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { levelLabel } from "../lib/levelLabel";
import { todayKey } from "../lib/date";
import { ProgressBar } from "../components/ProgressBar";
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
  if (!loading) {
    for (const word of words) {
      if (data.memorized[word.id]) {
        memorizedCount++;
        for (const level of word.levels) {
          memorizedByLevel.set(level, (memorizedByLevel.get(level) ?? 0) + 1);
        }
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
      </div>

      <section>
        <h2>Levels</h2>
        <div className={styles.levels}>
          {indexData.map((entry) => {
            const memorized = memorizedByLevel.get(entry.level) ?? 0;
            return (
              <Link
                key={entry.level}
                to={`/${lang}/words/${entry.level}`}
                className={styles.levelRow}
              >
                <div className={styles.levelHeader}>
                  <span>Level {levelLabel(lang, entry.level)}</span>
                  <span className={styles.levelCount}>
                    {loading ? "…" : `${memorized} / ${entry.count}`}
                  </span>
                </div>
                <ProgressBar
                  value={loading || entry.count === 0 ? 0 : memorized / entry.count}
                />
              </Link>
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
