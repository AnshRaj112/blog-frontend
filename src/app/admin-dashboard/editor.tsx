// pages/admin-dashboard/editor.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "./Editor.module.scss";
import TagSelector from "../components/TagSelector/TagSelector";
import axios from "axios";
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

  useEffect(() => {
    if (blogId) {
      fetchExistingContent();
    }
  }, [blogId]);

  const fetchExistingContent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(res.data.content || "");
    } catch (err) {
      console.error("Error loading existing blog content", err);
    }
  };

  const handleDone = () => {
    setShowTagSelector(true);
  };

  const handleTagSubmit = async (tags: string[]) => {
    try {
      await axios.post(
        "http://localhost:5000/admin/blog/content",
        { blogId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.post(
        "http://localhost:5000/admin/blog/tags",
        { blogId, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Blog saved successfully!");
      router.push("/admin-dashboard");
    } catch (err) {
      console.error("Error saving blog", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className={styles.editorPage}>
      <h1>Edit Blog Content</h1>

      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="Paste your content from Google Docs here..."
        className={styles.editor}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        }}
      />

      <button onClick={handleDone} className={styles.doneButton}>
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
