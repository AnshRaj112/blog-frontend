"use client";

import React, { useState } from 'react';
import styles from './FilterBar.module.scss';
import { IoFilterOutline, IoChevronDown } from 'react-icons/io5';

type Props = {
  selectedTags: string[];
  sort: string;
  onTagsChange: (tags: string[]) => void;
  onSortChange: (sort: string) => void;
  availableTags: string[];
};

const FilterBar: React.FC<Props> = ({
  selectedTags,
  sort,
  onTagsChange,
  onSortChange,
  availableTags,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTagChange = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newSelectedTags);
  };

  return (
    <div className={styles.filterBar}>
      <IoFilterOutline />

      {/* Tag Dropdown */}
      <div className={styles.tagDropdown}>
        <label onClick={() => setShowDropdown(!showDropdown)}>
          Tags <IoChevronDown />
        </label>
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            {availableTags.map((tag) => (
              <div key={tag} className={styles.tagOption}>
                <input
                  type="checkbox"
                  id={`tag-${tag}`}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                <label htmlFor={`tag-${tag}`}>{tag}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sort Selector */}
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
