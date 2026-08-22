import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { shuffle } from "../lib/random";
import { InfoIcon } from "./Icons";
import styles from "./InfoTooltip.module.css";

const SAMPLE_SIZE = 5;
const MARGIN = 8;
// Conservative estimates for the bubble's rendered size, used to decide
// whether it needs to flip above the trigger or clamp to the opposite edge
// instead of running off-screen. Actual content is smaller in most cases,
// so this errs toward more room than necessary rather than less.
const ESTIMATED_HEIGHT = 180;
const ESTIMATED_WIDTH = 340;

interface InfoTooltipProps {
  label: string;
  /** The full word pool to sample examples from - re-shuffled on every
   * hover/focus so repeat visits show different words. */
  words: string[];
}

interface Coords {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

/** A hover/focus-triggered info bubble. Rendered through a portal into
 * `document.body` and positioned via the trigger's screen coordinates -
 * this keeps it out of any ancestor's stacking context (e.g. a hovered
 * sibling card applying `transform`), which otherwise could let a later
 * element's own icon paint on top of an open bubble. Placement flips
 * above/below and clamps left/right so it never runs off the viewport. */
export function InfoTooltip({ label, words }: InfoTooltipProps) {
  const [sample, setSample] = useState<string[]>(() => shuffle(words).slice(0, SAMPLE_SIZE));
  const [coords, setCoords] = useState<Coords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const show = () => {
    if (words.length > 0) setSample(shuffle(words).slice(0, SAMPLE_SIZE));
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < ESTIMATED_HEIGHT + MARGIN && rect.top > ESTIMATED_HEIGHT;
    const spaceOnRight = window.innerWidth - rect.right;
    const alignLeft = spaceOnRight < ESTIMATED_WIDTH - rect.width && rect.left > ESTIMATED_WIDTH;

    setCoords({
      top: openUpward ? undefined : rect.bottom + MARGIN,
      bottom: openUpward ? window.innerHeight - rect.top + MARGIN : undefined,
      left: alignLeft ? rect.left : undefined,
      right: alignLeft ? undefined : window.innerWidth - rect.right,
    });
  };
  const hide = () => setCoords(null);

  return (
    <span className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={label}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        <InfoIcon size={20} />
      </button>
      {coords &&
        createPortal(
          <span role="tooltip" className={styles.bubble} style={coords}>
            <span className={styles.bubbleTitle}>Example words</span>
            <span className={styles.bubbleWords}>
              {sample.length > 0 ? sample.join(" · ") : "No examples available"}
            </span>
          </span>,
          document.body,
        )}
    </span>
  );
}
