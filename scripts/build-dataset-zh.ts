import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { LevelIndexEntry, ZhWord } from "../src/types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SOURCE_PATH = resolve(ROOT, "data/zh/complete.json");
const OUT_DIR = resolve(ROOT, "src/data/zh");
const LEVELS_DIR = resolve(OUT_DIR, "levels");

interface RawEntry {
  simplified: string;
  radical: string;
  level: string[];
  frequency: number;
  pos: string[];
  forms: {
    traditional?: string;
    transcriptions: { pinyin: string };
    meanings: string[];
  }[];
}

function parseNewLevels(levels: string[]): number[] {
  return levels
    .filter((l) => l.startsWith("new-"))
    .map((l) => Number.parseInt(l.slice("new-".length), 10))
    .filter((n) => Number.isFinite(n));
}

/** In this dataset, proper-noun readings (surnames, place names, etc.) are
 * marked by a capitalized first letter in the pinyin, e.g. 白 has forms
 * ["Bái" -> "surname Bai"] and ["bái" -> "white", ...]. Detecting the
 * capitalization directly is more reliable than matching on the meaning
 * text (e.g. 马's surname form has a second meaning "abbr. for Malaysia"
 * that isn't surname-related, so text matching alone misses it). */
function isProperNounForm(form: RawEntry["forms"][number]): boolean {
  const first = form.transcriptions.pinyin.charAt(0);
  return first !== "" && first === first.toUpperCase() && first !== first.toLowerCase();
}

const MAX_FORMS = 3;

/** Ranks a word's forms most-likely-first instead of picking just one, so a
 * heteronym's other readings stay in the dataset for the flashcard's tabs.
 * Non-proper-noun forms sort ahead of "surname X" / place-name readings, and
 * within each group the form with more listed meanings sorts first -
 * dictionaries tend to list more senses for the more productive/common
 * pronunciation (e.g. 熬 lists "áo" with 4 meanings vs "āo" with 2; "áo" as
 * in 熬夜 is the one learners need). Capped at MAX_FORMS so the flashcard's
 * tab row stays small. */
function rankForms(entry: RawEntry): RawEntry["forms"] {
  const bySenseCount = (list: RawEntry["forms"]) =>
    [...list].sort((a, b) => b.meanings.length - a.meanings.length);

  const common = entry.forms.filter((f) => !isProperNounForm(f));
  const proper = entry.forms.filter((f) => isProperNounForm(f));
  return [...bySenseCount(common), ...bySenseCount(proper)].slice(0, MAX_FORMS);
}

function toWord(entry: RawEntry, levels: number[], seen: Map<string, number>): ZhWord {
  const forms = rankForms(entry).map((f) => ({
    traditional:
      f.traditional && f.traditional !== entry.simplified ? f.traditional : undefined,
    pinyin: f.transcriptions.pinyin,
    meanings: f.meanings,
  }));
  const primary = forms[0];
  const baseId = `${entry.simplified}#${primary.pinyin}`;
  const count = seen.get(baseId) ?? 0;
  seen.set(baseId, count + 1);
  const id = count === 0 ? baseId : `${baseId}#${count}`;

  return {
    id,
    lang: "zh",
    simplified: entry.simplified,
    traditional: primary.traditional,
    pinyin: primary.pinyin,
    meanings: primary.meanings,
    forms,
    levels,
    pos: entry.pos ?? [],
    frequency: entry.frequency,
  };
}

function main() {
  const raw: RawEntry[] = JSON.parse(readFileSync(SOURCE_PATH, "utf-8"));

  const byLevel = new Map<number, ZhWord[]>();
  for (let level = 1; level <= 7; level++) byLevel.set(level, []);

  const idSeen = new Map<string, number>();
  let hsk3Count = 0;

  for (const entry of raw) {
    if (!entry.forms?.length) continue;
    const newLevels = parseNewLevels(entry.level);
    if (newLevels.length === 0) continue;

    hsk3Count++;
    for (const level of newLevels) {
      const word = toWord(entry, newLevels, idSeen);
      byLevel.get(level)!.push(word);
    }
  }

  mkdirSync(LEVELS_DIR, { recursive: true });

  const index: LevelIndexEntry[] = [];
  for (const [level, words] of byLevel) {
    words.sort((a, b) => a.frequency - b.frequency);
    writeFileSync(resolve(LEVELS_DIR, `${level}.json`), JSON.stringify(words));
    index.push({ level, count: words.length });
  }
  index.sort((a, b) => a.level - b.level);

  writeFileSync(resolve(OUT_DIR, "index.json"), JSON.stringify(index));

  console.log(`Processed ${hsk3Count} HSK 3.0 words into ${LEVELS_DIR}`);
  for (const { level, count } of index) {
    console.log(`  level ${level}: ${count} words`);
  }
}

main();
