"use client"

import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard/BlogCard';
import BlogModal from '../components/BlogModal/BlogModal';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterBar from '../components/FilterBar/FilterBar';
import axios from 'axios';

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
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, [search, tag, sort]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/blogs?page=1`;

      if (search) url += `&title=${search}`;
      if (tag) url += `&tag=${tag}`;
      if (sort) {
        const [field, order] = sort.split('-');
        url += `&sort=${field}&order=${order}`;
      }

      const res = await axios.get(url);
      setBlogs(res.data.blogs || []);
      const tagsFromBlogs = new Set(res.data.blogs.flatMap((b: Blog) => b.tags));
      setAllTags([...tagsFromBlogs]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Latest Blogs</h1>
      <SearchBar onSearch={setSearch} />
      <FilterBar
        tags={allTags}
        selectedTag={tag}
        sort={sort}
        onTagChange={setTag}
        onSortChange={setSort}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} onClick={() => setSelectedBlog(blog)}>
            <BlogCard {...blog} />
          </div>
        ))
      )}

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
