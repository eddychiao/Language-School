import { useEffect, useMemo, useState } from "react";
import type { Language, LevelIndexEntry, Word } from "../types";
import zhIndex from "../data/zh/index.json";
import esIndex from "../data/es/index.json";

/** Per-level word counts for a language, used to render level pickers. Both
 * index files are tiny (7 entries), so it's fine to bundle both statically. */
export function levelIndex(lang: Language): LevelIndexEntry[] {
  return lang === "zh" ? zhIndex : esIndex;
}

const cache = new Map<string, Word[]>();
const inflight = new Map<string, Promise<Word[]>>();

// The generated JSON's `lang` field widens to `string` through a plain JSON
// module import, so the loader result needs an explicit cast back to the
// literal-typed `Word` union - the build script is the actual source of truth
// for the shape, not this import.
type WordsModule = { default: unknown[] };

const ZH_LEVEL_LOADERS: Record<number, () => Promise<WordsModule>> = {
  1: () => import("../data/zh/levels/1.json"),
  2: () => import("../data/zh/levels/2.json"),
  3: () => import("../data/zh/levels/3.json"),
  4: () => import("../data/zh/levels/4.json"),
  5: () => import("../data/zh/levels/5.json"),
  6: () => import("../data/zh/levels/6.json"),
  7: () => import("../data/zh/levels/7.json"),
};

const ES_LEVEL_LOADERS: Record<number, () => Promise<WordsModule>> = {
  1: () => import("../data/es/levels/1.json"),
  2: () => import("../data/es/levels/2.json"),
  3: () => import("../data/es/levels/3.json"),
  4: () => import("../data/es/levels/4.json"),
  5: () => import("../data/es/levels/5.json"),
  6: () => import("../data/es/levels/6.json"),
  7: () => import("../data/es/levels/7.json"),
};

function loaderFor(lang: Language) {
  return lang === "zh" ? ZH_LEVEL_LOADERS : ES_LEVEL_LOADERS;
}

function cacheKey(lang: Language, level: number): string {
  return `${lang}:${level}`;
}

export function loadLevel(lang: Language, level: number): Promise<Word[]> {
  const key = cacheKey(lang, level);
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);

  const existing = inflight.get(key);
  if (existing) return existing;

  const loader = loaderFor(lang)[level];
  if (!loader) return Promise.resolve([]);

  const promise = loader().then((mod) => {
    const words = mod.default as Word[];
    cache.set(key, words);
    inflight.delete(key);
    return words;
  });
  inflight.set(key, promise);
  return promise;
}

/** Loads and caches a single level's word chunk. Used by the List/Flashcard browse views. */
export function useLevelData(lang: Language, level: number | null) {
  const key = level !== null ? cacheKey(lang, level) : null;
  const [words, setWords] = useState<Word[] | null>(
    key !== null ? (cache.get(key) ?? null) : null,
  );
  const [loading, setLoading] = useState(key !== null && !cache.has(key));

  useEffect(() => {
    if (level === null) {
      setWords(null);
      setLoading(false);
      return;
    }
    const cacheEntry = cache.get(cacheKey(lang, level));
    if (cacheEntry) {
      setWords(cacheEntry);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    loadLevel(lang, level)
      .then((loaded) => {
        if (!cancelled) {
          setWords(loaded);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lang, level]);

  return { words, loading };
}

/** Loads and caches multiple levels' word chunks, merged. Used by the Test Session
 * Builder and Lesson Planner where more than one level can be selected at once. */
export function useLevelsData(lang: Language, levels: number[]) {
  const key = useMemo(
    () => `${lang}:${[...levels].sort((a, b) => a - b).join(",")}`,
    [lang, levels],
  );
  const [words, setWords] = useState<Word[]>(() =>
    levels.flatMap((level) => cache.get(cacheKey(lang, level)) ?? []),
  );
  const [loading, setLoading] = useState(
    levels.some((level) => !cache.has(cacheKey(lang, level))),
  );

  useEffect(() => {
    if (levels.length === 0) {
      setWords([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(levels.map((level) => loadLevel(lang, level)))
      .then((chunks) => {
        if (!cancelled) {
          setWords(chunks.flat());
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { words, loading };
}
