import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import { verifyPassword } from '../helper/helper';
import styles from '../styles/Username.module.css';

export default function Password() {

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: 'admin@123'
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      
      let loginPromise = verifyPassword({ username, password: values.password });
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successfully...!</b>,
        error: <b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile');
      });
    }
  });

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center min-h-screen'>
        <div className={`${styles.glass} w-full max-w-md`}>

          <div className="title flex flex-col items-center">
            <h4 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-2 sm:py-4 text-base sm:text-lg lg:text-xl w-3/4 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1 sm:py-2' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-2 sm:py-4'>
              <img src={apiData?.profile || avatar} className={`${styles.profile_img} w-24 h-24 sm:w-32 sm:h-32`} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-4 sm:gap-6">
              <input {...formik.getFieldProps('password')} className={`${styles.textbox} w-full max-w-xs`} type="password" placeholder='Password' />
              <button className={`${styles.btn} w-full max-w-xs`} type='submit'>Sign In</button>
            </div>

            <div className="text-center py-2 sm:py-4">
              <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
