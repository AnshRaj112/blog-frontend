"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.scss";
import CreateBlogModal from "../components/CreateBlogModal/CreateBlogModal";
import toast from "react-hot-toast";

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token) {
      router.push("/admin-login");
      return;
    }

    fetchBlogs();
  }, [token]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error("Unauthorized or error fetching blogs:", err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: string) => {
    setProcessingId(id);
    try {
      await axios.patch(
        `${API_URL}/api/blogs/${id}/visibility`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlogs();
      toast.success("Visibility toggled");
    } catch (err) {
      console.error("Toggle failed", err);
      toast.error("Toggle failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    setProcessingId(id);
    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
      toast.success("Blog deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/editor?id=${id}`);
  };

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      <button
        onClick={() => setShowCreateModal(true)}
        className={styles.createButton}
      >
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
                <td>{blog.isPublic ? "Public" : "Private"}</td>
                <td>
                  <button
                    onClick={() => handleEdit(blog._id)}
                    disabled={processingId === blog._id}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    disabled={processingId === blog._id}
                  >
                    {processingId === blog._id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => toggleVisibility(blog._id)}
                    disabled={processingId === blog._id}
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreateModal && (
        <CreateBlogModal
          onClose={() => setShowCreateModal(false)}
          onBlogCreated={() => {
            setShowCreateModal(false);
            router.push("/admin-dashboard/editor");
          }}
        />
      )}
    </div>
  );
}
