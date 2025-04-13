"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TagSelector.module.scss";

export default function TagSelector({
  onSubmit,
  onCancel,
}: {
  onSubmit: (tags: string[]) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]); // State to store fetched tags

  useEffect(() => {
    // Fetch tags from the backend on component mount
    const fetchTags = async () => {
      try {
        const response = await axios.get("/api/tags");
        setTags(response.data); // Store fetched tags in state
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, []);

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
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagButton} ${selected.includes(tag) ? styles.selected : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))
          ) : (
            <p>Loading tags...</p> // Show loading message if tags are not fetched yet
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={() => onSubmit(selected)} className={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
