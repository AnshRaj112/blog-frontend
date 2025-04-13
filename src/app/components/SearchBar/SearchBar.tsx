"use client"

import React, { useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';
import styles from './SearchBar.module.scss';

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);  // Trigger search when typing stops
    }, 500); // Delay the search for 500ms after the user stops typing

    // Cleanup the timer on every re-render or when searchTerm changes
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]); // Re-run effect if searchTerm changes

  return (
    <div className={styles.searchBar}>
      <IoMdSearch />
      <input
        type="text"
        placeholder="Search blogs by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Update local state on input change
      />
    </div>
  );
};

export default SearchBar;
