"use client"

// components/SearchBar/SearchBar.tsx
import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import styles from './SearchBar.module.scss';

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  return (
    <div className={styles.searchBar}>
      <IoMdSearch />
      <input
        type="text"
        placeholder="Search blogs by title..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;