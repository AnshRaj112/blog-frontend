"use client"

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
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);  // For storing selected tags
  const [sort, setSort] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]); // Store all unique tags for the filter bar

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch blogs when search, selectedTags or sort changes
  useEffect(() => {
    fetchBlogs();
  }, [search, selectedTags, sort]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `${baseURL}/blogs?page=1`;

      // If a search query exists, append it to the URL
      if (search) url += `&title=${search}`;

      // If tags are selected, append them to the URL
      if (selectedTags.length > 0) {
        selectedTags.forEach((tag) => {
          url += `&tag=${tag}`;
        });
      }

      // If sorting is selected, append it to the URL
      if (sort) {
        const [field, order] = sort.split('-');
        url += `&sort=${field}&order=${order}`;
      }

      const res = await axios.get(url);
      setBlogs(res.data.blogs || []);

      // Extract unique tags from the fetched blogs and set them in the state
      const tagsFromBlogs = new Set<string>();
      res.data.blogs.forEach((b: Blog) => {
        b.tags.forEach((tag) => tagsFromBlogs.add(tag));
      });
      setAllTags(Array.from(tagsFromBlogs));  // Store tags for the filter bar
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

      {/* Search Bar */}
      <SearchBar onSearch={setSearch} />

      {/* Filter Bar */}
      <FilterBar
        selectedTags={selectedTags}
        sort={sort}
        onTagsChange={setSelectedTags}
        onSortChange={setSort}
        availableTags={allTags}  // Pass availableTags to FilterBar
      />

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <IoReload className="spinner" size={32} />
          <p>Loading blogs...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {blogs.map((blog) => (
            <BlogCard key={blog._id} {...blog} />
          ))}
        </div>
      )}

      {/* Modal for viewing individual blog */}
      <BlogModal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title || ''}
        description={selectedBlog?.description || ''}
        tags={selectedBlog?.tags || []}
        slug={selectedBlog?.slug || ''}
      />
    </main>
  );
}
