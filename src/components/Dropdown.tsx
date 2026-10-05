import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./Icons";
import styles from "./Dropdown.module.css";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
}

/** Fully custom listbox dropdown - unlike a native `<select>`, the open
 * option list is our own markup, so it renders consistently (not as an
 * OS-drawn menu) across platforms. */
export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const el = listRef.current?.querySelector('[aria-selected="true"]');
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [open]);

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      commit(Math.min(options.length - 1, selectedIndex + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      commit(Math.max(0, selectedIndex - 1));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        <span>{selected?.label ?? ""}</span>
        <ChevronDownIcon size={16} />
      </button>
      {open && (
        <ul
          className={styles.list}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={onListKeyDown}
          ref={(node) => {
            listRef.current = node;
            node?.focus();
          }}
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              role="option"
              aria-selected={i === selectedIndex}
              className={`${styles.option} ${
                i === selectedIndex ? styles.optionSelected : ""
              }`}
              onClick={() => commit(i)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
