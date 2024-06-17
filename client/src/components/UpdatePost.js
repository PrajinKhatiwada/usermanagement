import React, { useState } from 'react';
import styles from '../styles/UpdatePost.module.css';

export default function UpdatePost({ post }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle post update
  };

  return (
    <form className={styles.updatePost} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Update Post</button>
    </form>
  );
}
