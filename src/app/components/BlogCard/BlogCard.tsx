import styles from './BlogCard.module.scss';

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  onReadMore: (id: string) => void;
  onReadBlog: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  description,
  thumbnail,
  tags,
  onReadMore,
  onReadBlog
}) => {
  const truncated = description.length > 200;

  return (
    <div className={styles.card}>
      <img src={thumbnail} alt={title} className={styles.thumbnail} />
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <p className={styles.description}>
          {truncated ? (
            <>
              {description.slice(0, 200)}...
              <span className={styles.readMore} onClick={() => onReadMore(id)}> Read more</span>
            </>
          ) : description}
        </p>

        <button className={styles.readButton} onClick={() => onReadBlog(id)}>
          Read Blog
        </button>

        <div className={styles.tags}>
          {tags.map((tag, i) => (
            <span key={i} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
