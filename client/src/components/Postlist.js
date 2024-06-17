import React from 'react';
import Post from './Post';
import styles from '../styles/PostList.module.css';

const dummyPosts = [
  { id: 1, title: 'Post 1', content: 'This is the first post', comments: [] },
  { id: 2, title: 'Post 2', content: 'This is the second post', comments: [] },
];

export default function PostList() {
  return (
    <div className={styles.postList}>
      {dummyPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
