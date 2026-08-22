import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { shuffle } from "../lib/random";
import { InfoIcon } from "./Icons";
import styles from "./InfoTooltip.module.css";

const SAMPLE_SIZE = 5;
// Matches --space-4, the margin the CSS max-width/max-height clamps also
// use, so the JS-computed position and the CSS size clamp agree on how
// much edge padding to leave.
const MARGIN = 16;
// Conservative estimates for the bubble's rendered size, used only to
// clamp its position to the viewport before it has actually rendered.
// Actual content is usually smaller, so this errs toward more room than
// necessary rather than less.
const ESTIMATED_HEIGHT = 180;
const ESTIMATED_WIDTH = 340;

interface InfoTooltipProps {
  label: string;
  /** The full word pool to sample examples from - re-shuffled on every
   * hover/focus so repeat visits show different words. */
  words: string[];
}

interface Coords {
  top: number;
  left: number;
}

/** A hover/focus-triggered info bubble. Rendered through a portal into
 * `document.body` and positioned via the trigger's screen coordinates -
 * this keeps it out of any ancestor's stacking context (e.g. a hovered
 * sibling card applying `transform`), which otherwise could let a later
 * element's own icon paint on top of an open bubble. Position is always
 * clamped to [MARGIN, viewport - size - MARGIN] on both axes, so the
 * bubble stays fully on-screen no matter where the trigger sits or how
 * small the window is. */
export function InfoTooltip({ label, words }: InfoTooltipProps) {
  const [sample, setSample] = useState<string[]>(() => shuffle(words).slice(0, SAMPLE_SIZE));
  const [coords, setCoords] = useState<Coords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const show = () => {
    if (words.length > 0) setSample(shuffle(words).slice(0, SAMPLE_SIZE));
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Clamp the estimated size itself first, so a window smaller than the
    // estimate still yields a sane upper bound for the position clamp
    // below (the bubble's own max-width/max-height shrink it to match).
    const width = Math.min(ESTIMATED_WIDTH, window.innerWidth - 2 * MARGIN);
    const height = Math.min(ESTIMATED_HEIGHT, window.innerHeight - 2 * MARGIN);

    const fitsBelow = rect.bottom + MARGIN + height <= window.innerHeight;
    const top = fitsBelow ? rect.bottom + MARGIN : rect.top - MARGIN - height;
    const clampedTop = Math.max(MARGIN, Math.min(top, window.innerHeight - MARGIN - height));
    const clampedLeft = Math.max(MARGIN, Math.min(rect.left, window.innerWidth - MARGIN - width));

    setCoords({ top: clampedTop, left: clampedLeft });
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
