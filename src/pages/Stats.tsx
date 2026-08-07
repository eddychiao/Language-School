import { useMemo } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { levelLabel } from "../lib/levelLabel";
import { headword } from "../lib/wordDisplay";
import { todayKey } from "../lib/date";
import { ProgressBar } from "../components/ProgressBar";
import styles from "./Stats.module.css";

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(todayKey(d));
  }
  return days;
}

export function Stats() {
  const lang = useLang();
  const { data } = useStudyStore();
  const indexData = levelIndex(lang);
  const allLevels = useMemo(() => indexData.map((entry) => entry.level), [indexData]);
  const { words, loading } = useLevelsData(lang, allLevels);

  const wordById = useMemo(() => new Map(words.map((w) => [w.id, w])), [words]);

  const totals = useMemo(() => {
    let right = 0;
    let wrong = 0;
    for (const session of data.stats.sessions) {
      right += session.right;
      wrong += session.wrong;
    }
    const accuracy = right + wrong === 0 ? null : right / (right + wrong);
    return { right, wrong, accuracy };
  }, [data.stats.sessions]);

  const days = useMemo(() => lastNDays(14), []);
  const maxReviews = Math.max(1, ...days.map((d) => data.stats.daily[d]?.reviews ?? 0));

  const memorizedByLevel = useMemo(() => {
    const map = new Map<number, number>();
    if (loading) return map;
    for (const word of words) {
      if (data.memorized[word.id]) {
        for (const level of word.levels) {
          map.set(level, (map.get(level) ?? 0) + 1);
        }
      }
    }
    return map;
  }, [words, loading, data.memorized]);

  const totalMemorized = useMemo(() => {
    let sum = 0;
    for (const count of memorizedByLevel.values()) sum += count;
    return sum;
  }, [memorizedByLevel]);

  const hardestWords = useMemo(() => {
    return Object.values(data.srs)
      .map((card) => ({
        card,
        wrongCount: card.history.filter((h) => h.grade === "wrong").length,
        word: wordById.get(card.wordId),
      }))
      .filter((entry) => entry.wrongCount > 0 && entry.word !== undefined)
      .sort((a, b) => b.wrongCount - a.wrongCount || a.card.ease - b.card.ease)
      .slice(0, 10);
  }, [data.srs, wordById]);

  return (
    <div className={styles.page}>
      <h1>Stats</h1>

      <div className={styles.summaryRow}>
        <Stat label="Memorized" value={loading ? "…" : totalMemorized} />
        <Stat
          label="Overall accuracy"
          value={
            totals.accuracy === null ? "—" : `${Math.round(totals.accuracy * 100)}%`
          }
        />
        <Stat label="Sessions" value={data.stats.sessions.length} />
      </div>

      <section>
        <h2 className={styles.sectionTitle}>Reviews (last 14 days)</h2>
        <div className={styles.barChart}>
          {days.map((day) => {
            const reviews = data.stats.daily[day]?.reviews ?? 0;
            const height = Math.round((reviews / maxReviews) * 100);
            return (
              <div
                key={day}
                className={styles.barColumn}
                title={`${day}: ${reviews} reviews`}
              >
                <div className={styles.bar} style={{ height: `${height}%` }} />
                <span className={styles.barLabel}>{day.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Per-level mastery</h2>
        <div className={styles.levels}>
          {indexData.map((entry) => {
            const memorized = memorizedByLevel.get(entry.level) ?? 0;
            const pct =
              entry.count === 0 ? 0 : Math.round((memorized / entry.count) * 100);
            return (
              <div key={entry.level} className={styles.levelRow}>
                <div className={styles.levelHeader}>
                  <span>Level {levelLabel(lang, entry.level)}</span>
                  <span className={styles.levelCount}>
                    {loading ? "…" : `${memorized} / ${entry.count} · ${pct}%`}
                  </span>
                </div>
                <ProgressBar
                  value={loading || entry.count === 0 ? 0 : memorized / entry.count}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Hardest words</h2>
        {hardestWords.length === 0 ? (
          <p className={styles.empty}>No missed words yet.</p>
        ) : (
          <ul className={styles.hardestList}>
            {hardestWords.map(({ card, wrongCount, word }) => (
              <li key={card.wordId} className={styles.hardestItem}>
                <span className={word!.lang === "zh" ? "hanzi" : undefined}>
                  {headword(word!)}
                </span>
                <span className={styles.hardestMeta}>
                  {word!.lang === "zh" ? `${word!.pinyin} — ` : ""}
                  {word!.meanings[0]}
                </span>
                <span className={styles.hardestCount}>{wrongCount}× wrong</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
