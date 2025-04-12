"use client"

import { useState } from 'react';
import styles from './SearchBar.module.scss';
import { IoMdSearch } from 'react-icons/io';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        placeholder="Search blog title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        <IoMdSearch size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
