import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../assets/profile.png'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'

export default function Password() {
    const formik = useFormik({
        initialValues:{
            password:'admin@123',
        },
        validate:passwordValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit : async values=>{
            console.log(values);
        }
    })

    return (
        <div className="container mx-auto">
            <Toaster position='top-center' reverseOrder={false}></Toaster>
            <div className='flex justify-center items-center min-h-screen'>
                <div className='glass w-full max-w-md'>
                    <div className='title'>
                        <h4 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Connect Nepal</h4>
                        <span className='py-4 text-lg md:text-xl text-center text-gray-500'>
                            Explore more about Nepal by connecting with us.
                        </span>
                    </div>
                    <form className='form' onSubmit={formik.handleSubmit}>
                        <div className='profile-container'>
                            <img src={avatar} className='profile_img w-24 sm:w-32' alt='avatar'/>
                        </div>
                        <div className='textbox flex flex-col items-center gap-6'>
                            <input {...formik.getFieldProps('password')} className='textbox w-full py-2 px-4 mb-4 rounded-lg shadow-sm text-lg' type="password" placeholder='Password'/>
                            <button type='submit' className='btn w-full py-3 text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition duration-300 ease-in-out'>Login</button>
                        </div>
                        <div className='text-center py-4'>
                            <span className='text-gray-500'>Forgot your password? <Link className='text-red-500' to="/reset">Reset here</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
