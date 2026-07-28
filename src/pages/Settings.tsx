import { useState } from "react";
import { useStudyStore } from "../store/useStudyStore";
import { useLang } from "../lib/useLang";
import { Toggle } from "../components/Toggle";
import type { Settings as SettingsType } from "../types";
import styles from "./Settings.module.css";

const THEME_OPTIONS: { value: SettingsType["theme"]; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function Settings() {
  const lang = useLang();
  const { data, updateSettings, resetProgress } = useStudyStore();
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetProgress();
    setConfirming(false);
  };

  return (
    <div className={styles.page}>
      <h1>Settings</h1>

      <div className={styles.row}>
        <span>Theme</span>
        <div className={styles.segmented} role="group" aria-label="Theme">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.segment} ${
                data.settings.theme === opt.value ? styles.segmentActive : ""
              }`}
              aria-pressed={data.settings.theme === opt.value}
              onClick={() => updateSettings({ theme: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {lang === "zh" && (
        <>
          <div className={styles.row}>
            <span>Show traditional characters</span>
            <Toggle
              checked={data.settings.showTraditional}
              onChange={(checked) => updateSettings({ showTraditional: checked })}
              ariaLabel="Show traditional characters"
            />
          </div>

          <div className={styles.row}>
            <span>Show pinyin on cards</span>
            <Toggle
              checked={data.settings.showPinyin}
              onChange={(checked) => updateSettings({ showPinyin: checked })}
              ariaLabel="Show pinyin on cards"
            />
          </div>
        </>
      )}

      <div className={styles.dangerZone}>
        <h2 className={styles.sectionTitle}>Danger zone</h2>
        <p className={styles.dangerText}>
          Resetting clears all SRS progress, memorized words, lesson plans, and stats
          from this device, for every language. This cannot be undone.
        </p>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
          onBlur={() => setConfirming(false)}
        >
          {confirming ? "Click again to confirm reset" : "Reset all progress"}
        </button>
      </div>
    </div>
  );
}
