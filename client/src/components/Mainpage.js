import React, { useContext } from 'react';
import PostList from './Postlist';
import CreatePost from './CreatePost';
import { UserRoleContext } from '../context/UserRoleContext';
import styles from '../styles/MainPage.module.css';

export default function MainPage() {
  const { userRole } = useContext(UserRoleContext);

  return (
    <div className={styles.container}>
      <h1>Main Page</h1>
      {userRole === 'admin' && <CreatePost />}
      <PostList />
    </div>
  );
}
