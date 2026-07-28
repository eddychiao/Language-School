import styles from "./MemorizedCheckbox.module.css";

interface MemorizedCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}

export function MemorizedCheckbox({
  checked,
  onToggle,
  label = "Memorized",
}: MemorizedCheckboxProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${checked ? styles.checked : ""}`}
      aria-pressed={checked}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <svg className={styles.icon} viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M4 10.5l3.5 3.5L16 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}
