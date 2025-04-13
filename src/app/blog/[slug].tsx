import { GetServerSideProps } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import BlogCard from '../components/BlogCard/BlogCard';
import styles from './BlogSlug.module.scss';
import { FaRegHeart, FaHeart } from 'react-icons/fa'; // Heart icons import

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
  reactions: { [key: string]: boolean }; // Track reactions (likes/dislikes)
};

type Comment = {
  _id: string;
  comment: string;
  username: string;
  userImage: string;
  createdAt: string;
  liked: boolean; // Track if the user liked the comment
};

type Props = {
  blog: Blog | null;
  recentBlogs: Blog[];
};

const BlogPage = ({ blog, recentBlogs }: Props) => {
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState<boolean>(blog?.reactions?.liked || false);

  if (!blog) {
    return (
      <div className={styles.blogPage}>
        <div className={styles.notFound}>
          <h2>Blog not found.</h2>
          <p>But hey, check out some of our other reads!</p>
        </div>

        <div className={styles.recentSection}>
          <h2>Recent Blogs</h2>
          {recentBlogs.map((b) => (
            <BlogCard key={b._id} {...b} />
          ))}
        </div>
      </div>
    );
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') {
      toast.error('Comment cannot be empty!');
      return;
    }

    try {
      const res = await axios.post(`/api/comments`, {
        blogId: blog._id,
        comment: newComment,
      });
      setComments([...comments, res.data]); // Add new comment
      setNewComment(''); // Clear input field
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to post comment! Please try again.');
    }
  };

  const handleReaction = async () => {
    try {
      await axios.patch(`/api/blogs/${blog._id}/reaction`, {
        remove: liked, // Toggle the reaction state
      });
      setLiked(!liked); // Toggle the like state locally
      toast.success('Reaction updated!');
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to update reaction!');
    }
  };

  const handleCommentReaction = (id: string, isLiked: boolean) => {
    // You can implement this functionality if required
    console.log('Comment reaction clicked:', id, isLiked);
  };

  return (
    <>
      <Head>
        <title>{blog.title} | Blog</title>
        <meta name="description" content={blog.description} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        {blog.thumbnail && <meta property="og:image" content={blog.thumbnail} />}
      </Head>

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
          <div className={styles.reaction} onClick={handleReaction}>
            {liked ? <FaHeart className={styles.liked} /> : <FaRegHeart />}
          </div>
        </div>

        <div className={styles.commentSection}>
          <h2>Comments</h2>
          <div className={styles.commentInput}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
          </div>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <img
                    src={comment.userImage || `https://api.adorable.io/avatars/80/anonymous.png`}
                    alt="User"
                    className={styles.userImage}
                  />
                  <span className={styles.username}>{comment.username}</span>
                </div>
                <p>{comment.comment}</p>
                <span className={styles.timestamp}>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
                <div className={styles.reaction} onClick={() => handleCommentReaction(comment._id, comment.liked)}>
                  {comment.liked ? <FaHeart className={styles.liked} /> : <FaRegHeart />}
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        <div className={styles.recentSection}>
          <h2>More Blogs</h2>
          {recentBlogs.map((b) => (
            <BlogCard key={b._id} {...b} />
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug;
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const [blogRes, recentRes] = await Promise.all([
      axios.get(`${baseURL}/blogs/${slug}`),
      axios.get(`${baseURL}/blogs?page=1`),
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
