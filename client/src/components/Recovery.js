import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

export default function Recovery() {
  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then(OTP => {
      console.log(OTP);
      if (OTP) return toast.success('OTP has been sent to your email!');
      return toast.error('Problem while generating OTP!');
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success('Verified Successfully!');
        return navigate('/reset');
      }
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!');
    }
  }

  function resendOTP() {
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise, {
      loading: 'Sending...',
      success: <b>OTP has been sent to your email!</b>,
      error: <b>Could not Send it!</b>,
    });

    sentPromise.then(OTP => {
      console.log(OTP);
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen">
        <div className={`${styles.glass} w-full max-w-lg p-4 sm:p-6 lg:p-8`}>
          <div className="title flex flex-col items-center">
            <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Recovery</h4>
            <span className="py-2 sm:py-4 text-base sm:text-lg lg:text-xl w-3/4 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>

          <form className="pt-10 sm:pt-20" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-4 sm:gap-6">
              <div className="input text-center">
                <span className="py-2 text-sm text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={e => setOTP(e.target.value)}
                  value={OTP}
                  className={`${styles.textbox} w-full max-w-xs`}
                  type="text"
                  placeholder="OTP"
                />
              </div>

              <button className={`${styles.btn} w-full max-w-xs`} type="submit">
                Recover
              </button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{' '}
              <button onClick={resendOTP} className="text-red-500">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
