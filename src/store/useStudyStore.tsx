import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Grade,
  LessonPlan,
  SessionRecord,
  Settings,
  StudyData,
} from "../types";
import { defaultData, loadData, saveData } from "./storage";
import { gradeCard } from "../srs/scheduler";

interface StudyStore {
  data: StudyData;
  gradeWord: (wordId: string, grade: Grade) => void;
  toggleMemorized: (wordId: string) => void;
  isMemorized: (wordId: string) => boolean;
  recordSession: (record: SessionRecord) => void;
  addLessonPlan: (plan: LessonPlan) => void;
  removeLessonPlan: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
}

const StudyStoreContext = createContext<StudyStore | null>(null);

function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function StudyStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyData>(() => loadData());

  const commit = useCallback((updater: (prev: StudyData) => StudyData) => {
    setData((prev) => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const gradeWord = useCallback(
    (wordId: string, grade: Grade) => {
      commit((prev) => {
        const updatedCard = gradeCard(wordId, prev.srs[wordId], grade);
        const srs =
          updatedCard === undefined
            ? prev.srs
            : { ...prev.srs, [wordId]: updatedCard };

        const day = todayKey();
        const dayStats = prev.stats.daily[day] ?? { reviews: 0, right: 0 };
        const daily = {
          ...prev.stats.daily,
          [day]: {
            reviews: dayStats.reviews + (grade === "skip" ? 0 : 1),
            right: dayStats.right + (grade === "right" ? 1 : 0),
          },
        };

        return { ...prev, srs, stats: { ...prev.stats, daily } };
      });
    },
    [commit],
  );

  const toggleMemorized = useCallback(
    (wordId: string) => {
      commit((prev) => {
        const memorized = { ...prev.memorized };
        if (memorized[wordId]) {
          delete memorized[wordId];
        } else {
          memorized[wordId] = true;
        }
        return { ...prev, memorized };
      });
    },
    [commit],
  );

  const isMemorized = useCallback(
    (wordId: string) => Boolean(data.memorized[wordId]),
    [data.memorized],
  );

  const recordSession = useCallback(
    (record: SessionRecord) => {
      commit((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          sessions: [record, ...prev.stats.sessions].slice(0, 200),
        },
      }));
    },
    [commit],
  );

  const addLessonPlan = useCallback(
    (plan: LessonPlan) => {
      commit((prev) => ({
        ...prev,
        lessonPlans: [...prev.lessonPlans, plan],
      }));
    },
    [commit],
  );

  const removeLessonPlan = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        lessonPlans: prev.lessonPlans.filter((p) => p.id !== id),
      }));
    },
    [commit],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      commit((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));
    },
    [commit],
  );

  const resetProgress = useCallback(() => {
    commit(() => defaultData());
  }, [commit]);

  const value = useMemo<StudyStore>(
    () => ({
      data,
      gradeWord,
      toggleMemorized,
      isMemorized,
      recordSession,
      addLessonPlan,
      removeLessonPlan,
      updateSettings,
      resetProgress,
    }),
    [
      data,
      gradeWord,
      toggleMemorized,
      isMemorized,
      recordSession,
      addLessonPlan,
      removeLessonPlan,
      updateSettings,
      resetProgress,
    ],
  );

  return (
    <StudyStoreContext.Provider value={value}>
      {children}
    </StudyStoreContext.Provider>
  );
}

export function useStudyStore(): StudyStore {
  const ctx = useContext(StudyStoreContext);
  if (!ctx) {
    throw new Error("useStudyStore must be used within a StudyStoreProvider");
  }
  return ctx;
}
