"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
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

    localStorage.setItem("newBlogMeta", JSON.stringify({ title, shortDesc }));

    if (thumbnail) {
      localStorage.setItem("newBlogThumbnailName", thumbnail.name);
      localStorage.setItem("newBlogThumbnailPreview", preview ?? "");
    }

    onClose();
    router.push("/admin-dashboard/editor");
  };

  // Reset state on unmount
  useEffect(() => {
    return () => {
      setTitle("");
      setShortDesc("");
      setThumbnail(null);
      setPreview(null);
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Create New Blog</h2>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Blog Title"
        />

        <textarea
          placeholder="Short Description"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          aria-label="Short Description"
        />

        <div className={styles.thumbnailUpload}>
          <label htmlFor="thumb">Thumbnail (optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            aria-label="Upload Thumbnail"
          />
          {preview && (
            <div className={styles.previewWrapper}>
              <Image
                src={preview}
                alt="Thumbnail Preview"
                width={300}
                height={180}
                className={styles.preview}
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleNext} className={styles.nextBtn}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
