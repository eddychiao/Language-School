import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { EsWord, LevelIndexEntry } from "../src/types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SOURCE_PATH = resolve(ROOT, "data/es/source.json");
const OUT_DIR = resolve(ROOT, "src/data/es");
const LEVELS_DIR = resolve(OUT_DIR, "levels");

interface SourceEntry {
  word: string;
  pos: string[];
  gender?: "m" | "f" | "mf";
  meanings: string[];
  rank: number;
}

// HSK's own level sizes (9 tiers, after splitting its combined "7-9" band
// into thirds), used as the proportional template for bucketing the
// frequency-ranked Spanish list into 9 tiers of similar shape (small early
// levels, large tail) instead of even splits.
const HSK_LEVEL_COUNTS = [506, 750, 953, 972, 1059, 1123, 1869, 1869, 1868];

function levelBoundaries(total: number): number[] {
  const hskTotal = HSK_LEVEL_COUNTS.reduce((a, b) => a + b, 0);
  const cumulative: number[] = [];
  let running = 0;
  for (const count of HSK_LEVEL_COUNTS) {
    running += count;
    cumulative.push(Math.round((running / hskTotal) * total));
  }
  cumulative[cumulative.length - 1] = total;
  return cumulative;
}

function levelForRank(rank: number, boundaries: number[]): number {
  for (let i = 0; i < boundaries.length; i++) {
    if (rank <= boundaries[i]) return i + 1;
  }
  return boundaries.length;
}

function toWord(entry: SourceEntry, level: number, seen: Map<string, number>): EsWord {
  const baseId = `${entry.word}#${entry.pos[0]}`;
  const count = seen.get(baseId) ?? 0;
  seen.set(baseId, count + 1);
  const id = count === 0 ? baseId : `${baseId}#${count}`;

  return {
    id,
    lang: "es",
    word: entry.word,
    gender: entry.gender,
    meanings: entry.meanings,
    pos: entry.pos,
    levels: [level],
    frequency: entry.rank,
  };
}

function main() {
  const source: SourceEntry[] = JSON.parse(readFileSync(SOURCE_PATH, "utf-8"));
  const boundaries = levelBoundaries(source.length);

  const byLevel = new Map<number, EsWord[]>();
  for (let level = 1; level <= 9; level++) byLevel.set(level, []);

  const idSeen = new Map<string, number>();
  for (const entry of source) {
    const level = levelForRank(entry.rank, boundaries);
    byLevel.get(level)!.push(toWord(entry, level, idSeen));
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

  console.log(`Processed ${source.length} Spanish words into ${LEVELS_DIR}`);
  for (const { level, count } of index) {
    console.log(`  level ${level}: ${count} words`);
  }
}

main();
