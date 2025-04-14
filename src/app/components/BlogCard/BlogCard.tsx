"use client";

import React from 'react';
import styles from './BlogCard.module.scss';
import { FaEye } from 'react-icons/fa';
import { SlCalender } from "react-icons/sl";

type BlogCardProps = {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  slug: string;
  views: number;
  createdAt: string;
  onClick?: () => void;
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  description = '',
  thumbnail,
  tags = [],
  views,
  createdAt,
  onClick,
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.card} onClick={onClick}>
      {thumbnail && (
        <img src={thumbnail} alt={title} className={styles.thumbnail} />
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <p className={styles.description}>
          {description.length > 150 ? description.slice(0, 150) + '...' : description}
        </p>

        <div className={styles.meta}>
          <span className={styles.views}>
            <FaEye style={{ marginRight: '5px' }} />
            {views} views
          </span>
          <span className={styles.date}>
            <SlCalender style={{ marginRight: '5px' }} />
            {formattedDate}
          </span>
        </div>

        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>

        <button className={styles.readButton}>Read Blog</button>
      </div>
    </div>
  );
};

export default BlogCard;