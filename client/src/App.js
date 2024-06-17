import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserRoleProvider } from './context/UserRoleContext';

/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import MainPage from './components/Mainpage';
import PostList from './components/Postlist';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import UpdatePost from './components/UpdatePost';
import Comment from './components/Comment'



/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'


const router = createBrowserRouter([
    {
        path : '/',
        element : <Username></Username>
    },
    {
        path : '/register',
        element : <Register></Register>
    },
    {
        path : '/password',
        element : <ProtectRoute><Password /></ProtectRoute>
    },
  /** root routes */ 
  
    {

        path : '/profile',
        element : <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path : '/recovery',
        element : <Recovery></Recovery>
    },
    {
        path : '/reset',
        element : <Reset></Reset>
    },
    {
        path: '/main',
        element: <MainPage />,
      },
      {
        path: '/posts',
        element: <PostList />,
      },
      {
        path: '/post/:id',
        element: <Post />,
      },
      {
        path: '/create-post',
        element: <ProtectRoute><CreatePost /></ProtectRoute>,
      },
      {
        path: '/update-post/:id',
        element: <ProtectRoute><UpdatePost /></ProtectRoute>,
      },
      {
        path: '/comment/:id',
        element: <Comment />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
   
])

export default function App() {
  return (
    <UserRoleProvider>
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    </UserRoleProvider>
  )
}