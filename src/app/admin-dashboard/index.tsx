"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Dashboard.module.scss';
import CreateBlogModal from '../components/CreateBlogModal/CreateBlogModal'; // ✅ import modal

type Blog = {
  _id: string;
  title: string;
  views: number;
  isPublic: boolean;
  createdAt: string;
};

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false); // ✅ create modal state
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error('Unauthorized or error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/admin/blog/${id}/visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlogs();
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this blog?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/admin/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/editor?id=${id}`);
  };

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      {/* ✅ Create Blog Button */}
      <button onClick={() => setShowCreateModal(true)} className={styles.createButton}>
        + Create Blog
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.views}</td>
                <td>{blog.isPublic ? 'Public' : 'Private'}</td>
                <td>
                  <button onClick={() => handleEdit(blog._id)}>Edit</button>
                  <button onClick={() => handleDelete(blog._id)}>Delete</button>
                  <button onClick={() => toggleVisibility(blog._id)}>Toggle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Render Create Blog Modal */}
      {showCreateModal && (
        <CreateBlogModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
