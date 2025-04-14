"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import BlogCard from '../components/BlogCard/BlogCard';
import BlogModal from '../components/BlogModal/BlogModal';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterBar from '../components/FilterBar/FilterBar';
import { IoReload } from 'react-icons/io5';

type Blog = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  slug: string;
  views: number;
  createdAt: string;
};

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // ✅ Fetch predefined tags on first load
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/tags`);
        setAllTags(res.data);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    fetchTags();
  }, []);

  // ✅ Fetch blogs when filters/search/page change
  useEffect(() => {
    fetchBlogs();
  }, [search, selectedTags, sort, page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `${baseURL}/api/blogs?page=${page}&limit=15`;

      if (search) url += `&title=${search}`;
      if (selectedTags.length > 0) {
        selectedTags.forEach((tag) => {
          url += `&tag=${tag}`;
        });
      }
      if (sort) {
        const [field, order] = sort.split('-');
        url += `&sort=${field}&order=${order}`;
      }

      const res = await axios.get(url);
      const blogsData = res.data.blogs || []; // Ensure it defaults to an empty array
      setBlogs(blogsData);
      setTotalPages(res.data.totalPages || 1); // Assuming your backend returns this
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <Head>
        <title>Latest Blogs | MyBlog</title>
        <meta
          name="description"
          content="Read the latest blogs on various topics including tech, life, and trends."
        />
      </Head>

      <h1 style={{ marginBottom: '1rem' }}>Latest Blogs</h1>

      <SearchBar onSearch={setSearch} />

      <FilterBar
        selectedTags={selectedTags}
        sort={sort}
        onTagsChange={setSelectedTags}
        onSortChange={setSort}
        availableTags={allTags} // ✅ Now using predefined tags
      />

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <IoReload className="spinner" size={32} />
          <p>Loading blogs...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard key={blog._id} {...blog} />
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>
      )}

      <BlogModal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title || ''}
        description={selectedBlog?.description || ''}
        tags={selectedBlog?.tags || []}
        slug={selectedBlog?.slug || ''}
      />

      {/* Pagination Component */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
          <button
            key={pg}
            onClick={() => setPage(pg)}
            style={{
              margin: '0 5px',
              padding: '0.5rem 1rem',
              backgroundColor: pg === page ? '#333' : '#eee',
              color: pg === page ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {pg}
          </button>
        ))}
      </div>
    </main>
  );
}
