import { useParams } from "react-router-dom";
import type { Language } from "../types";

const VALID_LANGUAGES: Language[] = ["zh", "es"];

/** Reads the `:lang` route param, falling back to "zh" for anything not a
 * recognized language (missing param, stale/garbage URL, etc.). */
export function useLang(): Language {
  const { lang } = useParams<{ lang: string }>();
  return VALID_LANGUAGES.includes(lang as Language) ? (lang as Language) : "zh";
}
