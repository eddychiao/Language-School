import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Language, Word } from "../types";
import { headword, posLabel } from "../lib/wordDisplay";
import { MemorizedCheckbox } from "./MemorizedCheckbox";
import styles from "./WordTable.module.css";

interface WordTableProps {
  lang: Language;
  words: Word[];
  showTraditional?: boolean;
  isMemorized: (id: string) => boolean;
  onToggleMemorized: (id: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onRowClick?: (id: string) => void;
}

const ESTIMATED_ROW_HEIGHT = 57;

export function WordTable({
  lang,
  words,
  showTraditional = false,
  isMemorized,
  onToggleMemorized,
  expandedIds,
  onToggleExpand,
  onRowClick,
}: WordTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: words.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 12,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span className={styles.colHanzi}>Word</span>
        <span className={styles.colPinyin}>{lang === "zh" ? "Pinyin" : "Gender"}</span>
        <span className={styles.colMeaning}>Meaning</span>
        <span className={styles.colPos}>POS</span>
        <span className={styles.colCheck}>Memorized</span>
      </div>
      <div ref={parentRef} className={styles.scroller}>
        <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const word = words[virtualRow.index];
            const isExpanded = expandedIds.has(word.id);
            return (
              <div
                key={word.id}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className={styles.row}
                onClick={onRowClick ? () => onRowClick(word.id) : undefined}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  cursor: onRowClick ? "pointer" : undefined,
                }}
              >
                <span
                  className={
                    word.lang === "zh" ? `${styles.colHanzi} hanzi` : styles.colHanzi
                  }
                >
                  {headword(word)}
                  {word.lang === "zh" && showTraditional && word.traditional && (
                    <span className={styles.traditional}>
                      {" "}
                      ({word.traditional})
                    </span>
                  )}
                </span>
                <span className={styles.colPinyin}>
                  {word.lang === "zh" ? word.pinyin : (word.gender ?? "")}
                </span>
                <span
                  className={`${styles.colMeaning} ${
                    isExpanded ? styles.colMeaningExpanded : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(word.id);
                  }}
                  title={isExpanded ? "Click to collapse" : word.meanings[0]}
                >
                  {word.meanings[0]}
                </span>
                <span className={styles.colPos}>
                  {word.pos
                    .slice(0, 2)
                    .map((p) => posLabel(word, p))
                    .join(", ")}
                </span>
                <span className={styles.colCheck}>
                  <MemorizedCheckbox
                    checked={isMemorized(word.id)}
                    onToggle={() => onToggleMemorized(word.id)}
                    label=""
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
