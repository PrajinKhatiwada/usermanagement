import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { resetPasswordValidation } from '../helper/validate'

export default function Reset() {
    const formik = useFormik({
        initialValues:{
            password:'admin@123',
            confirm_pwd:'admin@123'
        },
        validate:resetPasswordValidation,
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
                <div className='glass w-full md:w-90 max-w-md p-6'>
                    <div className='title flex flex-col items-center'>
                        <h4 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Reset your password</h4>
                        <span className='py-4 text-lg md:text-xl text-center text-gray-500'>
                            Enter the new password.
                        </span>
                    </div>
                    <form className='py-10 md:py-20' onSubmit={formik.handleSubmit}>
                        <div className='textbox flex flex-col items-center gap-6'>
                            <input {...formik.getFieldProps('password')} className='textbox w-full p-2 rounded-lg shadow-sm text-lg' type="password" placeholder='Enter a new Password'/>
                            <input {...formik.getFieldProps('confirm_pwd')} className='textbox w-full p-2 rounded-lg shadow-sm text-lg' type="password" placeholder='Confirm your Password'/>
                            <button type='submit' className='btn w-full py-3 text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition duration-300 ease-in-out'>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
