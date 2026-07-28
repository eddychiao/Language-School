import { Link } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { levelLabel } from "../lib/levelLabel";
import { isDue } from "../srs/scheduler";
import { ProgressBar } from "../components/ProgressBar";
import styles from "./Home.module.css";

const LANGUAGE_NAMES = { zh: "Chinese", es: "Spanish" } as const;

export function Home() {
  const lang = useLang();
  const { data } = useStudyStore();
  const indexData = levelIndex(lang);
  const allLevels = indexData.map((entry) => entry.level);
  const { words, loading } = useLevelsData(lang, allLevels);

  const dueCount = Object.values(data.srs).filter((card) => isDue(card)).length;
  const memorizedCount = Object.keys(data.memorized).length;
  const totalWords = indexData.reduce((sum, entry) => sum + entry.count, 0);

  const memorizedByLevel = new Map<number, number>();
  if (!loading) {
    for (const word of words) {
      if (data.memorized[word.id]) {
        for (const level of word.levels) {
          memorizedByLevel.set(level, (memorizedByLevel.get(level) ?? 0) + 1);
        }
      }
    }
  }

  return (
    <div className={styles.page}>
      <h1>{LANGUAGE_NAMES[lang]}</h1>

      <div className={styles.summaryRow}>
        <SummaryStat label="Due today" value={dueCount} />
        <SummaryStat label="Memorized" value={`${memorizedCount} / ${totalWords}`} />
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
