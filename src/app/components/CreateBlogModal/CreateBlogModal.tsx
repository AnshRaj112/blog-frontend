// components/CreateBlogModal.tsx

"use client";

import { useState, ChangeEvent } from "react";
import styles from "./CreateBlogModal.module.scss";
import { useRouter } from "next/router";

export default function CreateBlogModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!title.trim() || !shortDesc.trim()) {
      alert("Title and description are required");
      return;
    }

    // Store in localStorage or pass via query to editor step
    localStorage.setItem("newBlogMeta", JSON.stringify({ title, shortDesc }));

    if (thumbnail) {
      localStorage.setItem("newBlogThumbnail", JSON.stringify(thumbnail.name)); // actual file will be uploaded in backend step
    }

    onClose();
    router.push("/admin-dashboard/editor");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create New Blog</h2>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Short Description"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
        />

        <div className={styles.thumbnailUpload}>
          <label htmlFor="thumb">Thumbnail (optional):</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className={styles.preview} />}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}
