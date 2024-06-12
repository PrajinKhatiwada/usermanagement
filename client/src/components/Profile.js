import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import  convertToBase64  from '../helper/convert'

export default function Profile() {
    const [file, setFile] = useState();
    const formik = useFormik({
        initialValues:{
          firstname:'',
          lastname:'',
          email:'example@cnogs.com',
          username:'example123',
          password:'admin@123',
          mobile:'',
          address:''
        },
        validate:profileValidation,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit : async values=>{
          values = await Object.assign(values, { profile: file || '' });
          console.log(values);
        }
    });

    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    };

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className='flex justify-center items-center h-screen'>
                <div className='glass w-full md:w-90 max-w-md p-6'>
                    <div className='title flex flex-col items-center'>
                        <h4 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Profile</h4>
                        <p className='py-2 text-lg md:text-xl text-center text-gray-500'>
                            Update your details below
                        </p>
                    </div>
                    <form className='py-4 md:py-8' onSubmit={formik.handleSubmit}>
                        <div className='profile flex justify-center py-4'>
                            <label htmlFor="profile" className='cursor-pointer'>
                                <img src={file || avatar} className='profile_img w-32 sm:w-40 rounded-full' alt='avatar' />
                            </label>
                            <input onChange={onUpload} type="file" id='profile' name='profile' className='hidden' />
                        </div>
                        <div className='textbox flex flex-col gap-6'>
                            <div className="name flex gap-4 md:gap-8">
                                <input {...formik.getFieldProps('firstname')} className='textbox w-full p-2 md:w-1/2' type="text" placeholder='First Name' />
                                <input {...formik.getFieldProps('lastname')} className='textbox w-full p-2 md:w-1/2' type="text" placeholder='Last Name' />
                            </div>
                            <div className="name flex gap-4 md:gap-8">
                                <input {...formik.getFieldProps('mobile')} className='textbox w-full p-2 md:w-1/2' type="text" placeholder='Mobile Number' />
                                <input {...formik.getFieldProps('email')} className='textbox w-full p-2 md:w-1/2' type="email" placeholder='Email' />
                            </div>
                            <input {...formik.getFieldProps('address')} className='textbox w-full p-2' type="text" placeholder='Address' />
                            <button type='submit' className='btn w-full py-3 text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition duration-300 ease-in-out'>Register</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>Already registered? <Link className='text-red-500' to="/">Logout</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
