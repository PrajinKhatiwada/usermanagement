import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { useFormik } from 'formik'
import { Toaster } from 'react-hot-toast'

export default function Username() {
    const formik = useFormik({
        initialValues:{
            username:''
        },
        onSubmit : async values=>{
            console.log(values);
        }
    })
    
    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className='flex justify-center items-center min-h-screen'>
                <div className='glass w-full md:w-90 max-w-md p-6'>
                    <div className='title flex flex-col items-center'>
                        <h4 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Connect Nepal</h4>
                        <span className='py-4 text-lg md:text-xl text-center text-gray-500'>
                            Explore more about Nepal by connecting with us.
                        </span>
                    </div>
                    <form className='py-4 md:py-8' onSubmit={formik.handleSubmit}>
                        <div className='profile-container flex justify-center py-4'>
                            <img src={avatar} className='w-24 h-24 rounded-full' alt='avatar'/>
                        </div>
                        <div className='textbox flex flex-col items-center gap-6'>
                            <input {...formik.getFieldProps('username')} className='w-full p-2 text-lg md:text-xl rounded-lg border' type="text" placeholder='Username'/>
                            <button type='submit' className='w-full p-2 text-lg md:text-xl bg-indigo-600 text-white rounded-lg'>Login</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>Not a member? <Link className='text-red-500' to="/register">Register here</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
