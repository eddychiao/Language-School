/**
 * One-time data prep: downloads the raw doozan/spanish_data files and
 * distills them into data/es/source.json — a trimmed, ready-to-level word
 * list analogous to data/zh/complete.json's role for the Chinese side.
 *
 * Not wired into predev/prebuild: the raw upstream files (17MB + 2.6MB) are
 * a general-purpose Wiktionary dump/frequency list far larger than what this
 * app needs, so this script is run by hand when the source data needs
 * refreshing, and only its distilled output is committed.
 *
 * Usage: tsx scripts/prepare-spanish-source.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "data/es/source.json");

const DICT_URL = "https://raw.githubusercontent.com/doozan/spanish_data/master/es-en.data";
const FREQ_URL = "https://raw.githubusercontent.com/doozan/spanish_data/master/frequency.csv";

const TARGET_COUNT = 10000;
// Pull a bit more than the target from frequency.csv since a small fraction
// of entries resolve to no usable gloss (redirect-only "form of X" entries).
const CANDIDATE_COUNT = 12000;

const REDIRECT_GLOSS = /^(form of|inflection of|alternative form of|alternative spelling of|obsolete form of|pronunciation spelling of|misspelling of|informal spelling of|eye dialect spelling of|dated spelling of|superseded spelling of|plural of|feminine of|masculine of|only used in|clipping of|short for)\b/i;

interface PosBlock {
  pos: string;
  gender?: string;
  meanings: string[];
}

/** Parses one dictionary entry body (everything after the headword line, up
 * to the next "_____" separator) into its `pos:`-tagged blocks. */
function parseBody(body: string): PosBlock[] {
  const lines = body.split("\n");
  const blocks: PosBlock[] = [];
  let current: PosBlock | null = null;
  let pendingGlossIndex = -1;

  for (const line of lines) {
    const posMatch = line.match(/^pos: (.+)$/);
    if (posMatch) {
      current = { pos: posMatch[1].trim(), meanings: [] };
      blocks.push(current);
      pendingGlossIndex = -1;
      continue;
    }
    if (!current) continue;

    const genderMatch = line.match(/^ {2}g: (.+)$/);
    if (genderMatch && !current.gender) {
      current.gender = genderMatch[1].trim();
      continue;
    }

    const glossMatch = line.match(/^ {2}gloss: (.+)$/);
    if (glossMatch) {
      const text = glossMatch[1].trim();
      if (!REDIRECT_GLOSS.test(text)) {
        current.meanings.push(text);
        pendingGlossIndex = current.meanings.length - 1;
      } else {
        pendingGlossIndex = -1;
      }
      continue;
    }

    // Qualifier immediately under the most recent kept gloss, e.g. region/register.
    const qualMatch = line.match(/^ {4}q: (.+)$/);
    if (qualMatch && pendingGlossIndex !== -1) {
      const qualifier = qualMatch[1].split(";")[0].trim();
      current.meanings[pendingGlossIndex] = `(${qualifier}) ${current.meanings[pendingGlossIndex]}`;
      pendingGlossIndex = -1;
    }
  }

  return blocks.filter((b) => b.meanings.length > 0);
}

function normalizeGender(raw: string | undefined): "m" | "f" | "mf" | undefined {
  if (!raw) return undefined;
  const head = raw.split(/[;<]/)[0].trim();
  if (/^m.*f|^f.*m|^mf/.test(head)) return "mf";
  if (head.startsWith("m")) return "m";
  if (head.startsWith("f")) return "f";
  return undefined;
}

async function main() {
  console.log("Downloading es-en.data and frequency.csv...");
  const [dictText, freqText] = await Promise.all([
    fetch(DICT_URL).then((r) => r.text()),
    fetch(FREQ_URL).then((r) => r.text()),
  ]);

  console.log("Parsing dictionary...");
  const dict = new Map<string, PosBlock[]>();
  for (const block of dictText.split("_____\n")) {
    const nl = block.indexOf("\n");
    if (nl === -1) continue;
    const word = block.slice(0, nl);
    const parsed = parseBody(block.slice(nl + 1));
    if (parsed.length === 0) continue;
    const existing = dict.get(word);
    if (existing) existing.push(...parsed);
    else dict.set(word, parsed);
  }

  console.log("Cross-referencing frequency list...");
  const freqLines = freqText.split("\n").slice(1);
  interface SourceEntry {
    word: string;
    pos: string[];
    gender?: "m" | "f" | "mf";
    meanings: string[];
    rank: number;
  }
  const entries: SourceEntry[] = [];
  let candidatesSeen = 0;

  for (const line of freqLines) {
    if (candidatesSeen >= CANDIDATE_COUNT || entries.length >= TARGET_COUNT) break;
    const parts = line.split(",");
    if (parts.length < 4) continue;
    const [, word, freqPos, flags] = parts;
    if (flags !== "") continue;
    candidatesSeen++;

    const blocks = dict.get(word);
    if (!blocks) continue;

    const matching = blocks.filter((b) => b.pos === freqPos);
    const useBlocks = matching.length > 0 ? matching : blocks;
    const meanings = useBlocks.flatMap((b) => b.meanings);
    if (meanings.length === 0) continue;

    const pos = [...new Set(useBlocks.map((b) => b.pos))];
    const gender = normalizeGender(useBlocks.find((b) => b.gender)?.gender);

    entries.push({ word, pos, gender, meanings, rank: entries.length + 1 });
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(entries));
  console.log(`Wrote ${entries.length} entries to ${OUT_PATH}`);
}

main();
