"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-hot-toast";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import styles from "./Editor.module.scss";
import TagSelector from "src/app/components/TagSelector/TagSelector";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogIdFromURL = searchParams.get("id");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [blogId, setBlogId] = useState<string | null>(blogIdFromURL);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (!blogIdFromURL) {
      const meta = localStorage.getItem("newBlogMeta");
      if (meta) {
        const { title, shortDesc } = JSON.parse(meta);
        setTitle(title);
        setShortDescription(shortDesc);
      }

      const preview = localStorage.getItem("newBlogThumbnailPreview");
      if (preview) {
        setThumbnail(preview);
      }
    }
  }, []);

  useEffect(() => {
    if (blogIdFromURL) {
      fetchExistingContent(blogIdFromURL);
    }
  }, [blogIdFromURL]);

  const fetchExistingContent = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle(res.data.title || "");
      setShortDescription(res.data.shortDescription || "");

      const content = res.data.content || "";
      const blocksFromHTML = convertFromHTML(content);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(state));
    } catch (err) {
      console.error("Error loading existing blog content", err);
      toast.error("Failed to load blog content.");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    const content = editorState.getCurrentContent().getPlainText();
    if (content.trim() === "") {
      toast.error("Content cannot be empty!");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required!");
      return;
    }
    setShowTagSelector(true);
  };

  const handleTagSubmit = async (tags: string[]) => {
    setLoading(true);
    try {
      const content = editorState.getCurrentContent().getPlainText();
      const payload = {
        title,
        shortDescription: shortDescription || content.slice(0, 100),
        content,
        tags,
        thumbnail,
      };

      if (!blogId) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlogId(res.data._id);
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("Blog saved successfully!");
      router.push("/admin-dashboard");
    } catch (err) {
      console.error("Error saving blog", err);
      toast.error("Something went wrong while saving the blog.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return <div>Loading editor...</div>;

  return (
    <div className={styles.editorPage}>
      <h1>{blogId ? "Edit Blog" : "Create New Blog"}</h1>

      {loading && <div className={styles.loading}>Loading...</div>}

      <div className={styles.editorWrapper}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          placeholder="Start typing your content here..."
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "list",
              "textAlign",
              "link",
              "image",
            ],
          }}
        />
      </div>

      <button
        onClick={handleDone}
        className={styles.doneButton}
        disabled={loading}
      >
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
