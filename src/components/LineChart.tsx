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
const PADDING_LEFT = 28;
const Y_TICKS = 4;

/** Rounds up to a "nice" axis max (1/2/5 × a power of ten) so the y-axis
 * doesn't show jagged values like 0, 3.25, 6.5, 9.75. */
function niceMax(value: number): number {
  if (value <= Y_TICKS) return Y_TICKS;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

/** Minimal dependency-free SVG line chart - the app has no charting library,
 * and this is the only chart shape needed (a single time series), so a
 * small hand-rolled component avoids pulling one in. */
export function LineChart({ points, height = 220, labelEvery }: LineChartProps) {
  const gradientId = useId();

  const { linePath, areaPath, coords, yTicks } = useMemo(() => {
    const rawMax = Math.max(0, ...points.map((p) => p.value));
    const max = niceMax(rawMax);
    const plotHeight = height - PADDING_Y * 2;
    const plotWidth = VIEW_WIDTH - PADDING_LEFT;
    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;
    const yFor = (value: number) => height - PADDING_Y - (value / max) * plotHeight;
    const coords = points.map((p, i) => ({
      x: PADDING_LEFT + (points.length > 1 ? i * stepX : plotWidth / 2),
      y: yFor(p.value),
      ...p,
    }));
    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
    const areaPath =
      coords.length > 0
        ? `${linePath} L${coords[coords.length - 1].x},${height} L${coords[0].x},${height} Z`
        : "";
    const yTicks = Array.from({ length: Y_TICKS + 1 }, (_, i) => {
      const value = Math.round((max / Y_TICKS) * i);
      return { value, y: yFor(value) };
    });
    return { linePath, areaPath, coords, yTicks };
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
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PADDING_LEFT}
              x2={VIEW_WIDTH}
              y1={tick.y}
              y2={tick.y}
              className={styles.gridline}
            />
            <text x={PADDING_LEFT - 6} y={tick.y} className={styles.yLabel}>
              {tick.value}
            </text>
          </g>
        ))}
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
