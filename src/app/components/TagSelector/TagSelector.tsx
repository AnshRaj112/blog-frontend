"use client"
// components/TagSelector.tsx

import { useState } from "react";
import styles from "./TagSelector.module.scss";

const predefinedTags = [
  "Tech",
  "JavaScript",
  "React",
  "Next.js",
  "AI",
  "Tutorial",
  "Opinion",
];

export default function TagSelector({
  onSubmit,
  onCancel,
}: {
  onSubmit: (tags: string[]) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Select Tags</h2>
        <div className={styles.tags}>
          {predefinedTags.map((tag) => (
            <button
              key={tag}
              className={selected.includes(tag) ? styles.selected : ""}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onSubmit(selected)}>Submit</button>
        </div>
      </div>
    </div>
  );
}
