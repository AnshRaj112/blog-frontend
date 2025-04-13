"use client";

// components/FilterBar/FilterBar.tsx
import React from 'react';
import styles from './FilterBar.module.scss';
import { IoFilterOutline } from 'react-icons/io5';

type Props = {
  selectedTags: string[];
  sort: string;
  onTagsChange: (tags: string[]) => void;
  onSortChange: (sort: string) => void;
  availableTags: string[]; // Add the availableTags prop
};

const FilterBar: React.FC<Props> = ({ selectedTags, sort, onTagsChange, onSortChange, availableTags }) => {
  // Handle changes in tag selection
  const handleTagChange = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newSelectedTags);
  };

  return (
    <div className={styles.filterBar}>
      <IoFilterOutline />

      {/* Tag Filters (Multiple Select) */}
      <div className={styles.tagSelector}>
        <label>Tags</label>
        <div className={styles.tags}>
          {availableTags.map((tag) => (
            <div key={tag} className={styles.tagOption}>
              <input
                type="checkbox"
                id={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Sorting Options */}
      <div className={styles.sortSelector}>
        <label>Sort By</label>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="">Sort By</option>
          <option value="views-asc">Views ↑</option>
          <option value="views-desc">Views ↓</option>
          <option value="date-newest">Newest</option>
          <option value="date-oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
