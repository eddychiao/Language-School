import type { StudyData } from "../types";

const STORAGE_KEY = "hsk-study:v1";
const SAVE_DEBOUNCE_MS = 250;

export function defaultData(): StudyData {
  return {
    version: 1,
    srs: {},
    memorized: {},
    lessonPlans: [],
    stats: { sessions: [], daily: {} },
    settings: {
      showTraditional: false,
      showPinyin: true,
      hideMemorized: false,
      theme: "system",
      language: "zh",
    },
  };
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__hsk_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage =
  typeof window !== "undefined" && isLocalStorageAvailable();
let memoryFallback: StudyData | null = null;

export function normalizeData(parsed: unknown): StudyData | null {
  if (!parsed || typeof parsed !== "object") return null;
  const candidate = parsed as StudyData;
  if (candidate.version !== 1) return null;
  const fallback = defaultData();
  return {
    ...fallback,
    ...candidate,
    settings: { ...fallback.settings, ...candidate.settings },
  };
}

export function loadData(): StudyData {
  if (!hasLocalStorage) {
    return memoryFallback ?? (memoryFallback = defaultData());
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultData();
  try {
    return normalizeData(JSON.parse(raw)) ?? defaultData();
  } catch {
    return defaultData();
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveData(data: StudyData) {
  if (!hasLocalStorage) {
    memoryFallback = data;
    return;
  }
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // quota exceeded or storage unavailable mid-session; drop silently
    }
  }, SAVE_DEBOUNCE_MS);
}
