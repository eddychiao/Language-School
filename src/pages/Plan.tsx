import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore";
import { useLevelsData, levelIndex } from "../store/useLevelData";
import { useLang } from "../lib/useLang";
import { levelLabel } from "../lib/levelLabel";
import { LevelChips } from "../components/LevelChips";
import { LessonCard } from "../components/LessonCard";
import { buildLessonPlan } from "../lib/lessonPlanner";
import type { LessonPlan } from "../types";
import styles from "./Plan.module.css";

export function Plan() {
  const lang = useLang();
  const navigate = useNavigate();
  const { data, addLessonPlan, removeLessonPlan } = useStudyStore();

  const allLevels = useMemo(() => levelIndex(lang).map((entry) => entry.level), [lang]);

  const [levels, setLevels] = useState<number[]>([1]);
  const [order, setOrder] = useState<LessonPlan["order"]>("frequency");
  const [splitMode, setSplitMode] = useState<"size" | "count">("size");
  const [setSizeValue, setSetSizeValue] = useState(25);
  const [lessonCount, setLessonCount] = useState(10);
  const [collapsedPlans, setCollapsedPlans] = useState<Set<string>>(new Set());

  const { words: pool, loading } = useLevelsData(lang, levels);

  // Lesson plans store word IDs at creation time; if the underlying word data
  // is ever regenerated those IDs can drift, so counts are computed against
  // this live pool rather than trusted from the stored lists' lengths - that
  // keeps the plan list's counts consistent with what a lesson actually shows.
  const { words: allWords, loading: allWordsLoading } = useLevelsData(lang, allLevels);
  const validWordIds = useMemo(
    () => new Set(allWords.map((w) => w.id)),
    [allWords],
  );

  const plansForLang = data.lessonPlans.filter(
    (p) => (p.language ?? "zh") === lang,
  );

  const createPlan = () => {
    const label = levels.map((l) => levelLabel(lang, l)).join("+");
    const plan = buildLessonPlan({
      name: `Level ${label} · ${
        splitMode === "size" ? `${setSizeValue}/lesson` : `${lessonCount} lessons`
      }`,
      language: lang,
      levels,
      words: pool,
      order,
      setSize: splitMode === "size" ? setSizeValue : undefined,
      lessonCount: splitMode === "count" ? lessonCount : undefined,
    });
    addLessonPlan(plan);
  };

  const toggleCollapsed = (planId: string) => {
    setCollapsedPlans((prev) => {
      const next = new Set(prev);
      if (next.has(planId)) {
        next.delete(planId);
      } else {
        next.add(planId);
      }
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <h1>Lesson planner</h1>

      <section className={styles.builder}>
        <h2 className={styles.sectionTitle}>Levels</h2>
        <LevelChips lang={lang} levels={allLevels} selected={levels} onChange={setLevels} />

        <h2 className={styles.sectionTitle}>Split by</h2>
        <div className={styles.splitRow}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              checked={splitMode === "size"}
              onChange={() => setSplitMode("size")}
            />
            Words per lesson
          </label>
          {splitMode === "size" && (
            <input
              type="number"
              min={1}
              value={setSizeValue}
              onChange={(e) => setSetSizeValue(Math.max(1, Number(e.target.value)))}
              className={styles.numberInput}
            />
          )}
        </div>
        <div className={styles.splitRow}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              checked={splitMode === "count"}
              onChange={() => setSplitMode("count")}
            />
            Number of lessons
          </label>
          {splitMode === "count" && (
            <input
              type="number"
              min={1}
              value={lessonCount}
              onChange={(e) => setLessonCount(Math.max(1, Number(e.target.value)))}
              className={styles.numberInput}
            />
          )}
        </div>

        <h2 className={styles.sectionTitle}>Order</h2>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as LessonPlan["order"])}
          className={styles.select}
        >
          <option value="frequency">Frequency (common first)</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>

        <button
          type="button"
          className={styles.createButton}
          disabled={loading || pool.length === 0}
          onClick={createPlan}
        >
          Create plan
        </button>
      </section>

      <section className={styles.plans}>
        {plansForLang.length === 0 ? (
          <p className={styles.empty}>No lesson plans yet.</p>
        ) : (
          plansForLang.map((plan) => {
            const isCollapsed = collapsedPlans.has(plan.id);
            const resolvedLessons = plan.lessons.map((lesson) => ({
              lesson,
              wordIds: allWordsLoading
                ? lesson.wordIds
                : lesson.wordIds.filter((id) => validWordIds.has(id)),
            }));
            const totalWords = resolvedLessons.reduce(
              (sum, l) => sum + l.wordIds.length,
              0,
            );
            const totalMemorized = resolvedLessons.reduce(
              (sum, l) => sum + l.wordIds.filter((id) => data.memorized[id]).length,
              0,
            );

            return (
              <div key={plan.id} className={styles.planGroup}>
                <div className={styles.planHeader}>
                  <button
                    type="button"
                    className={styles.planToggle}
                    onClick={() => toggleCollapsed(plan.id)}
                    aria-expanded={!isCollapsed}
                  >
                    <span
                      className={`${styles.chevron} ${
                        isCollapsed ? styles.chevronCollapsed : ""
                      }`}
                    >
                      <ChevronIcon />
                    </span>
                    <span className={styles.planTitleGroup}>
                      <span className={styles.planName}>{plan.name}</span>
                      <span className={styles.planSubtitle}>
                        {plan.lessons.length} lesson
                        {plan.lessons.length === 1 ? "" : "s"} · {totalMemorized} /{" "}
                        {totalWords} memorized
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeLessonPlan(plan.id)}
                  >
                    Delete
                  </button>
                </div>
                <div
                  className={`${styles.collapseWrapper} ${
                    isCollapsed ? styles.collapsed : ""
                  }`}
                >
                  <div className={styles.collapseInner}>
                    <div className={styles.lessonGrid}>
                      {resolvedLessons.map(({ lesson, wordIds }) => {
                        const memorizedCount = wordIds.filter(
                          (id) => data.memorized[id],
                        ).length;
                        return (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            total={wordIds.length}
                            memorizedCount={memorizedCount}
                            onStudyFlashcards={() =>
                              navigate(`/${lang}/plan/${plan.id}/lesson/${lesson.id}`)
                            }
                            onStartTest={() =>
                              navigate(`/${lang}/study`, {
                                state: {
                                  lesson: {
                                    wordIds: lesson.wordIds,
                                    levels: plan.levels,
                                    label: `${plan.name} · ${lesson.label}`,
                                  },
                                },
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}
