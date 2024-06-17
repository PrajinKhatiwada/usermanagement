import React, { useContext } from 'react';
import Comment from './Comment';
import { UserRoleContext } from '../context/UserRoleContext';
import styles from '../styles/Post.module.css';

export default function Post({ post }) {
  const { userRole } = useContext(UserRoleContext);

  return (
    <div className={styles.post}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {userRole === 'admin' && <button>Edit</button>}
      <div className={styles.comments}>
        {post.comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <div>
        <textarea placeholder="Add a comment"></textarea>
        <button>Submit</button>
      </div>
    </div>
  );
}
