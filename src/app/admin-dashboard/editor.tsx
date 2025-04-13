"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "./Editor.module.scss";
import TagSelector from "../components/TagSelector/TagSelector";
import axios from "axios";
import { toast } from "react-hot-toast";  // Add toast for user feedback
import 'react-quill/dist/quill.snow.css';

// Dynamically import react-quill because it uses window
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditorPage() {
  const router = useRouter();
  const blogId = router.query.id as string;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [content, setContent] = useState<string>("");
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state for better UX

  useEffect(() => {
    if (blogId) {
      fetchExistingContent();
    }
  }, [blogId]);

  const fetchExistingContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(res.data.content || "");
    } catch (err) {
      console.error("Error loading existing blog content", err);
      toast.error("Failed to load blog content.");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    if (content.trim() === "") {
      toast.error("Content cannot be empty!");
      return;
    }
    setShowTagSelector(true);
  };

  const handleTagSubmit = async (tags: string[]) => {
    setLoading(true);
    try {
      // Save the blog content
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/blog/content`,
        { blogId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save the tags
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/blog/tags`,
        { blogId, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Blog saved successfully!");
      router.push("/admin-dashboard");
    } catch (err) {
      console.error("Error saving blog", err);
      toast.error("Something went wrong while saving the blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editorPage}>
      <h1>Edit Blog Content</h1>

      {loading && <div className={styles.loading}>Loading...</div>}

      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="Start typing your content here..."
        className={styles.editor}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ["blockquote"],
            ["clean"], // To clear the editor content
          ],
        }}
      />

      <button onClick={handleDone} className={styles.doneButton} disabled={loading}>
        Done
      </button>

      {showTagSelector && (
        <TagSelector
          onSubmit={handleTagSubmit}
          onCancel={() => setShowTagSelector(false)}
        />
      )}
    </div>
  );
}