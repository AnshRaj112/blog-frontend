"use client"

import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard/BlogCard';
import SearchBar from '../components/SearchBar/SearchBar';
import styles from './Home.module.scss';

interface Blog {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchBlogs = async (query = '', pageNumber = 1) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/blogs?search=${query}&page=${pageNumber}&limit=15`
      );
      const data = await res.json();
      setBlogs(data);
      setHasMore(data.length === 15); // If we get 15, maybe there's more
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs(searchQuery, page);
  }, [searchQuery, page]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when new search is triggered
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <SearchBar onSearch={handleSearch} />

      <div className={styles.grid}>
        {blogs.map((blog: Blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            title={blog.title}
            description={blog.description}
            thumbnail={blog.thumbnail}
            tags={blog.tags}
            onReadMore={() => console.log("Read more clicked", blog._id)}
            onReadBlog={() => console.log("Read blog clicked", blog._id)}
          />
        ))}
      </div>

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={page === 1}>
          ← Prev
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={!hasMore}>
          Next →
        </button>
      </div>
    </div>
  );
}
