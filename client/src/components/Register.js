import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import  convertToBase64  from '../helper/convert'

export default function Register() {
    const [file, setFile] = useState()
    const formik = useFormik({
        initialValues: {
            email: 'example@cnogs.com',
            username: 'example123',
            password: 'admin@123'
        },
        validate: registerValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { profile: file || '' })
            console.log(values);
        }
    })
    /** formik does not support file upload so we need to create the handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className='flex justify-center items-center h-screen'>
                <div className='glass w-full max-w-md' style={{ width: "45%" }}>
                    <div className='title flex flex-col items-center'>
                        <h4 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Register</h4>
                        <span className='py-4 text-lg md:text-xl text-center text-gray-500'>
                            Happy to join you!
                        </span>
                    </div>
                    <form className='py-1' onSubmit={formik.handleSubmit}>
                        <div className='profile-container flex justify-center py-4'>
                            <label htmlFor="profile">
                            <img src={file || avatar} className='profile_img w-32 sm:w-40 rounded-full' alt='avatar'/>

                            </label>
                            <input className='hidden'onChange={onUpload} type="file" id='profile' name='profile'/>
                        </div>
                        <div className='textbox flex flex-col items-center gap-6'>
                            <input {...formik.getFieldProps('email')} className='textbox w-full py-2 px-4 mb-4 rounded-lg shadow-sm text-lg' type="email" placeholder='Email'/>
                            <input {...formik.getFieldProps('username')} className='textbox w-full py-2 px-4 mb-4 rounded-lg shadow-sm text-lg' type="text" placeholder='Username'/>
                            <input {...formik.getFieldProps('password')} className='textbox w-full py-2 px-4 mb-4 rounded-lg shadow-sm text-lg' type="password" placeholder='Password'/>
                            <button type='submit' className='btn w-full py-3 text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition duration-300 ease-in-out'>Register</button>
                        </div>
                        <div className='text-center py-3'>
                            <span className='text-gray-500'>Already registered? <Link className='text-red-500' to="/">Login Now</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
