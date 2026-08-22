import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number; // 0..1
  label?: string;
}

/** Progress fill color interpolates from red (0%) to green (100%) so
 * completion is visible at a glance, and shifts gradually as the underlying
 * count changes rather than jumping between fixed states. */
function progressColor(clamped: number): string {
  const hue = clamped * 120; // 0 = red, 120 = green
  return `hsl(${hue.toFixed(0)}, 65%, 45%)`;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const pct = Math.round(clamped * 100);
  return (
    <div className={styles.wrapper}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: progressColor(clamped) }}
        />
      </div>
    </div>
  );
}
