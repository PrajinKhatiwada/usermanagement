import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';

import styles from '../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: 'harke@gmail.com',
      username: 'Harka',
      password: 'Harka@123'
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        values = await Object.assign(values, { profile: file || '' });
        console.log('Form Values:', values); // Debug: Log form values

        let registerPromise = registerUser({ credentials: values });

        toast.promise(registerPromise, {
          loading: 'Creating...',
          success: <b>Register Successfully...!</b>,
          error: err => <b>Could not Register: {err.error?.message || 'Unknown error'}</b>
        });

        await registerPromise;
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
        toast.error(`Registration failed: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const onUpload = async e => {
    try {
      const file = e.target.files[0];
      console.log('Selected file:', file); // Debug: Log selected file
      const base64 = await convertToBase64(file);
      console.log('Base64 string:', base64); // Debug: Log base64 string
      setFile(base64);
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file.');
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '3em' }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to join you!
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='Password*' />
              <button className={styles.btn} type='submit' disabled={formik.isSubmitting}>Register</button>
            </div>
            <div className="text-center py-4">
              <span className='text-gray-500'>Already Register? <Link className='text-red-500' to="/">Login Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
