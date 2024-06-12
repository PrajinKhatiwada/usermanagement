import React from 'react'
import { Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import avatar from '../assets/profile.png'
export default function Recovery() {
    
  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center min-h-screen'>
        <div className='glass w-full max-w-md'>
          <div className='title flex flex-col items-center'>
            <h4 className='text-3xl md:text-4xl lg:text-5xl font-bold'>Recover your Password</h4>
            <span className='py-6 text-lg md:text-xl text-center text-gray-600'>
              Enter OTP to recover password.
            </span>
          </div>
          <form className='py-4 md:py-8'>
            <div className='profile-container flex justify-center py-4'>
              <img src={avatar} className='profile_img' alt='avatar'/>
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className="input text-center">
                <span className='py-2 text-sm md:text-base text-left text-gray-500'>
                  Enter 6-digit OTP sent to your email address.
                </span>
                <input className='w-full py-2 px-4 mb-4 rounded-lg shadow-sm text-lg' type="password" placeholder='OTP code'/>
              </div>
              <button type='submit' className='w-full py-3 text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition duration-300 ease-in-out'>Recover</button>
            </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>Can't get OTP? <Link className='text-red-500'>Resend</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
