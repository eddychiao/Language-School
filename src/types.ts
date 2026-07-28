export type Language = "zh" | "es";

export interface WordForm {
  traditional?: string;
  pinyin: string;
  meanings: string[];
}

interface WordBase {
  id: string;
  meanings: string[];
  pos: string[];
  levels: number[]; // 1..7, per-language tiers (zh: HSK, 7 == HSK 7-9; es: invented frequency bands)
  frequency: number; // rank within the language's word list, lower = more common
}

export interface ZhWord extends WordBase {
  lang: "zh";
  simplified: string;
  /** Convenience copy of forms[0] - the most-likely reading. */
  traditional?: string;
  pinyin: string;
  /** All readings worth showing for this character, most-likely first,
   * capped at 3. Has one entry for words with a single pronunciation. */
  forms: WordForm[];
}

export interface EsWord extends WordBase {
  lang: "es";
  word: string;
  gender?: "m" | "f" | "mf";
}

export type Word = ZhWord | EsWord;

export interface LevelIndexEntry {
  level: number;
  count: number;
}

export type Grade = "right" | "wrong" | "skip";

export interface SrsCard {
  wordId: string;
  reps: number;
  intervalDays: number;
  ease: number;
  dueDate: number; // epoch ms
  lastGrade: Grade;
  history: { at: number; grade: Grade }[];
}

export interface SessionConfig {
  language: Language;
  levels: number[]; // ignored if wordIds is set (lesson-scoped session)
  wordIds?: string[]; // explicit pool, e.g. from a Lesson
  size: number; // 1..100
  onlyUnmemorized: boolean;
  order: "due" | "frequency" | "random";
  /** When true, cards show meaning/pinyin first and flip to the character. */
  reversed: boolean;
}

export interface SessionRecord {
  at: number;
  config: SessionConfig;
  right: number;
  wrong: number;
  skipped: number;
  durationMs: number;
  wordIds: string[];
}

export interface Lesson {
  id: string;
  label: string;
  wordIds: string[];
}

export interface LessonPlan {
  id: string;
  name: string;
  language: Language;
  levels: number[];
  order: "frequency" | "alphabetical" | "random";
  lessons: Lesson[];
  createdAt: number;
}

export interface Settings {
  showTraditional: boolean;
  showPinyin: boolean;
  theme: "system" | "light" | "dark";
  /** Last-viewed language, used to pick where "/" redirects to. */
  language: Language;
}

export interface StudyData {
  version: 1;
  srs: Record<string, SrsCard>;
  memorized: Record<string, true>;
  lessonPlans: LessonPlan[];
  stats: {
    sessions: SessionRecord[];
    daily: Record<string, { reviews: number; right: number }>;
  };
  settings: Settings;
}
