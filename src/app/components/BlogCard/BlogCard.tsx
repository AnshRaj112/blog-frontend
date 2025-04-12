import React from 'react';
import styles from './BlogCard.module.scss';
import { useRouter } from 'next/router';

type BlogCardProps = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  slug: string;
};

const BlogCard: React.FC<BlogCardProps> = ({ title, description, thumbnail, tags, slug }) => {
  const router = useRouter();

  return (
    <div className={styles.card}>
      {thumbnail && <img src={thumbnail} alt={title} className={styles.thumbnail} />}
      <h3>{title}</h3>
      <p>{description.slice(0, 150)}...</p>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>#{tag}</span>
        ))}
      </div>
      <button onClick={() => router.push(`/blog/${slug}`)}>Read Blog</button>
    </div>
  );
};

export default BlogCard;
