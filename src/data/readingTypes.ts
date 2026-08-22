export type ReadingDifficulty = "beginner" | "intermediate" | "advanced";

export interface ReadingPassage {
  id: string;
  difficulty: ReadingDifficulty;
  /** Rough level band the vocabulary is drawn from (HSK for zh, CEFR for es). */
  band: string;
  title: string;
  titleEn: string;
  /** Passage body, one entry per paragraph. */
  paragraphs: string[];
  /** English translation, parallel to `paragraphs` (same length/order). */
  translation: string[];
  /** Comprehension questions with tap-to-reveal answers, in the target language. */
  questions: { q: string; a: string }[];
}
