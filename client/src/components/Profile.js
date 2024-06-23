import React, { useState } from 'react';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';

export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate();
 
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  });

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  // logout handler function
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center min-h-screen'>
        <div className={`${styles.glass} ${extend.glass} w-full max-w-lg`} style={{ paddingTop: '3em' }}>

          <div className="title flex flex-col items-center">
            <h4 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>Profile</h4>
            <span className='py-2 sm:py-4 text-base sm:text-lg lg:text-xl w-3/4 text-center text-gray-500'>
                You can update the details.
            </span>
          </div>

          <form className='py-1 sm:py-2' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-2 sm:py-4'>
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img} w-24 h-24 sm:w-32 sm:h-32`} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' className="hidden" />
            </div>

            <div className="textbox flex flex-col items-center gap-4 sm:gap-6">
              <div className="name flex flex-col sm:flex-row w-full gap-4 sm:gap-10">
                <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='First Name' />
                <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Last Name' />
              </div>

              <div className="contact flex flex-col sm:flex-row w-full gap-4 sm:gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.' />
                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' />
              </div>

              <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox} w-full`} type="text" placeholder='Address' />
              <button className={`${styles.btn} w-full`} type='submit'>Update</button>
            </div>

            <div className="text-center py-2 sm:py-4">
              <span className='text-gray-500'>Come back later? <button onClick={userLogout} className='text-red-500'>Logout</button></span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
