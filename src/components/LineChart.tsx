import { useId, useMemo } from "react";
import styles from "./LineChart.module.css";

export interface LineChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  points: LineChartPoint[];
  height?: number;
  /** Show an x-axis label every N points (defaults to roughly 7 labels total). */
  labelEvery?: number;
}

const VIEW_WIDTH = 600;
const PADDING_Y = 14;

/** Minimal dependency-free SVG line chart - the app has no charting library,
 * and this is the only chart shape needed (a single time series), so a
 * small hand-rolled component avoids pulling one in. */
export function LineChart({ points, height = 220, labelEvery }: LineChartProps) {
  const gradientId = useId();

  const { linePath, areaPath, coords } = useMemo(() => {
    const max = Math.max(1, ...points.map((p) => p.value));
    const plotHeight = height - PADDING_Y * 2;
    const stepX = points.length > 1 ? VIEW_WIDTH / (points.length - 1) : 0;
    const coords = points.map((p, i) => ({
      x: points.length > 1 ? i * stepX : VIEW_WIDTH / 2,
      y: height - PADDING_Y - (p.value / max) * plotHeight,
      ...p,
    }));
    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
    const areaPath =
      coords.length > 0
        ? `${linePath} L${coords[coords.length - 1].x},${height} L${coords[0].x},${height} Z`
        : "";
    return { linePath, areaPath, coords };
  }, [points, height]);

  if (points.length === 0) {
    return <p className={styles.empty}>No data yet.</p>;
  }

  const step = labelEvery ?? Math.max(1, Math.ceil(points.length / 7));

  return (
    <div className={styles.wrapper} style={{ height }}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Line chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="3" className={styles.dot}>
            <title>{`${c.label}: ${c.value}`}</title>
          </circle>
        ))}
      </svg>
      <div className={styles.labels}>
        {coords.map((c, i) =>
          i % step === 0 || i === coords.length - 1 ? (
            <span
              key={i}
              className={styles.label}
              style={{ left: `${(c.x / VIEW_WIDTH) * 100}%` }}
            >
              {c.label}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
