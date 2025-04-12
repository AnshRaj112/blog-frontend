"use client"

import React from 'react';
import styles from './BlogModal.module.scss';
import { useRouter } from 'next/navigation';

type BlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  tags: string[];
  slug: string;
};

const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  tags,
  slug,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
              onClick={() => {
                router.push(`/?tag=${tag}`);
                onClose();
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
        <button className={styles.readMore} onClick={() => router.push(`/blog/${slug}`)}>
          Read Blog
        </button>
      </div>
    </div>
  );
};

export default BlogModal;
