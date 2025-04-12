import { GetServerSideProps } from 'next';
import axios from 'axios';
import BlogCard from '../components/BlogCard/BlogCard';
import styles from './BlogSlug.module.scss';

type Blog = {
  _id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  thumbnail?: string;
  slug: string;
  views: number;
  createdAt: string;
};

type Props = {
  blog: Blog | null;
  recentBlogs: Blog[];
};

const BlogPage = ({ blog, recentBlogs }: Props) => {
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className={styles.blogPage}>
      <div className={styles.blogContainer}>
        <h1>{blog.title}</h1>
        {blog.thumbnail && (
          <img src={blog.thumbnail} alt={blog.title} className={styles.thumbnail} />
        )}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className={styles.tags}>
          {blog.tags.map((tag) => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2>More Blogs</h2>
        {recentBlogs.map((b) => (
          <BlogCard key={b._id} {...b} />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;

  try {
    const [blogRes, recentRes] = await Promise.all([
      axios.get(`http://localhost:5000/blogs/${slug}`),
      axios.get(`http://localhost:5000/blogs?page=1`),
    ]);

    return {
      props: {
        blog: blogRes.data.blog || null,
        recentBlogs: recentRes.data.blogs || [],
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        blog: null,
        recentBlogs: [],
      },
    };
  }
};

export default BlogPage;
