import { useEffect, useId, useMemo, useRef, useState } from "react";
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

const PADDING_TOP = 20;
const PADDING_BOTTOM = 14;
const PADDING_LEFT = 32;
const PADDING_RIGHT = 8;
const Y_TICKS = 4;
const FALLBACK_WIDTH = 600;

/** Rounds up to a "nice" axis max (1/2/5 × a power of ten) so the y-axis
 * doesn't show jagged values like 0, 3.25, 6.5, 9.75. */
function niceMax(value: number): number {
  if (value <= Y_TICKS) return Y_TICKS;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const niceNormalized =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

/** Smooth quadratic-bezier path through every point (control points at the
 * midpoint of each segment) - reads as a gentle curve instead of sharp
 * triangular spikes, without needing a charting library. */
function smoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) return `M${coords[0].x},${coords[0].y}`;
  let d = `M${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    d += ` Q${curr.x},${curr.y} ${midX},${midY}`;
  }
  const last = coords[coords.length - 1];
  d += ` L${last.x},${last.y}`;
  return d;
}

/** Minimal dependency-free SVG line chart - the app has no charting library,
 * and this is the only chart shape needed (a single time series), so a
 * small hand-rolled component avoids pulling one in.
 *
 * The viewBox is sized to the container's actual measured pixel width (via
 * ResizeObserver) rather than a fixed value scaled with
 * `preserveAspectRatio="none"` - stretching a fixed-aspect viewBox to fit an
 * arbitrary container distorts strokes and dots unevenly (thicker on
 * diagonal segments than flat ones), which is what "looks terrible" here. */
export function LineChart({ points, height = 220, labelEvery }: LineChartProps) {
  const gradientId = useId();
  const chartAreaRef = useRef<HTMLDivElement | null>(null);
  // Measuring the chart area's own box (rather than trusting the `height`
  // prop) accounts for the labels row below it eating into the wrapper's
  // fixed height - the SVG's viewBox then always matches its real rendered
  // pixels 1:1, so nothing gets stretched non-uniformly.
  const [box, setBox] = useState({ width: FALLBACK_WIDTH, height: height - 24 });

  useEffect(() => {
    const el = chartAreaRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect && rect.width > 0 && rect.height > 0) {
        setBox({ width: rect.width, height: rect.height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height: chartHeight } = box;

  const { linePath, areaPath, coords, yTicks } = useMemo(() => {
    const rawMax = Math.max(0, ...points.map((p) => p.value));
    const max = niceMax(rawMax);
    const plotHeight = chartHeight - PADDING_TOP - PADDING_BOTTOM;
    const plotWidth = width - PADDING_LEFT - PADDING_RIGHT;
    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;
    const yFor = (value: number) =>
      chartHeight - PADDING_BOTTOM - (value / max) * plotHeight;
    const coords = points.map((p, i) => ({
      x: PADDING_LEFT + (points.length > 1 ? i * stepX : plotWidth / 2),
      y: yFor(p.value),
      ...p,
    }));
    const linePath = smoothPath(coords);
    const areaPath =
      coords.length > 0
        ? `${linePath} L${coords[coords.length - 1].x},${chartHeight - PADDING_BOTTOM} L${coords[0].x},${chartHeight - PADDING_BOTTOM} Z`
        : "";
    const yTicks = Array.from({ length: Y_TICKS + 1 }, (_, i) => {
      const value = Math.round((max / Y_TICKS) * i);
      return { value, y: yFor(value) };
    });
    return { linePath, areaPath, coords, yTicks };
  }, [points, chartHeight, width]);

  if (points.length === 0) {
    return <p className={styles.empty}>No data yet.</p>;
  }

  const step = labelEvery ?? Math.max(1, Math.ceil(points.length / 7));

  return (
    <div className={styles.wrapper} style={{ height }}>
      <div className={styles.chartArea} ref={chartAreaRef}>
        <svg
          className={styles.svg}
          width={width}
          height={chartHeight}
          viewBox={`0 0 ${width} ${chartHeight}`}
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
                x2={width - PADDING_RIGHT}
                y1={tick.y}
                y2={tick.y}
                className={styles.gridline}
              />
              <text x={PADDING_LEFT - 8} y={tick.y} className={styles.yLabel}>
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
      </div>
      <div className={styles.labels}>
        {coords.map((c, i) =>
          i % step === 0 || i === coords.length - 1 ? (
            <span
              key={i}
              className={styles.label}
              style={{ left: `${(c.x / width) * 100}%` }}
            >
              {c.label}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}
