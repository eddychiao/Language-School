import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "./Icons";
import styles from "./Select.module.css";

/** Styled drop-in replacement for a native `<select>` - keeps native
 * behavior (keyboard nav, option list) but replaces the OS-drawn chevron/
 * chrome with one that matches the rest of the design system. */
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={styles.wrapper}>
      <select className={`${styles.select} ${className ?? ""}`} {...props} />
      <ChevronDownIcon size={16} />
    </span>
  );
}
