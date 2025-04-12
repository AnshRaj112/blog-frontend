"use client"

// components/FilterBar/FilterBar.tsx
import React from 'react';
import styles from './FilterBar.module.scss';
import { IoFilterOutline } from 'react-icons/io5';

type Props = {
  tags: string[];
  selectedTag: string;
  sort: string;
  onTagChange: (tag: string) => void;
  onSortChange: (sort: string) => void;
};

const FilterBar: React.FC<Props> = ({ tags, selectedTag, sort, onTagChange, onSortChange }) => {
  return (
    <div className={styles.filterBar}>
      <IoFilterOutline />
      <select value={selectedTag} onChange={(e) => onTagChange(e.target.value)}>
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
        <option value="">Sort By</option>
        <option value="views-asc">Views ↑</option>
        <option value="views-desc">Views ↓</option>
        <option value="date-newest">Newest</option>
        <option value="date-oldest">Oldest</option>
      </select>
    </div>
  );
};

export default FilterBar;