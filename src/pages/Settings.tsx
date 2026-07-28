import { useRef, useState } from "react";
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
  const { data, updateSettings, resetProgress, importData } = useStudyStore();
  const [confirming, setConfirming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<unknown>(null);
  const [importError, setImportError] = useState(false);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetProgress();
    setConfirming(false);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `language-school-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setPendingImport(JSON.parse(await file.text()));
      setImportError(false);
    } catch {
      setPendingImport(null);
      setImportError(true);
    }
  };

  const confirmImport = () => {
    const ok = importData(pendingImport);
    setPendingImport(null);
    setImportError(!ok);
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

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Backup &amp; transfer</h2>
        <p className={styles.dangerText}>
          Export your progress to a file, then import it on another browser or
          device to bring your memorized words, SRS progress, and stats with
          you.
        </p>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleExport}
          >
            Export progress
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => fileInputRef.current?.click()}
          >
            Import progress
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />
        </div>
        {pendingImport !== null && (
          <div className={styles.importConfirm}>
            <p className={styles.dangerText}>
              Importing will replace all current progress on this device.
              This cannot be undone.
            </p>
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.resetButton}
                onClick={confirmImport}
              >
                Replace progress
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setPendingImport(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {importError && (
          <p className={styles.errorText}>
            That file couldn&apos;t be imported — make sure it&apos;s a
            progress file exported from this app.
          </p>
        )}
      </div>

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
