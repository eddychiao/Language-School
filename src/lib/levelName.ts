// A CEFR-style difficulty progression, shared across languages since both
// zh and es now use the same 9-tier band structure (frequency-based for es,
// HSK-based for zh).
const DIFFICULTY_NAMES = [
  "Beginner",
  "Elementary",
  "Pre-Intermediate",
  "Intermediate",
  "Upper Intermediate",
  "Advanced",
  "Proficient",
  "Fluent",
  "Mastery",
];

export function levelName(level: number): string {
  return DIFFICULTY_NAMES[level - 1] ?? `Level ${level}`;
}
