import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../../utils/GlobalVars';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(BACKEND_URL + 'auth/forgot-password', { email });

      toast.success(
        <div className='flex items-center'>
          <img
            src='public\assets\img\images\faq_shape03.png'
            alt='Success'
            className='w-6 h-6 mr-2'
          />
          <span>Password reset email sent successfully!</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'bg-green-600 text-white text-sm font-medium rounded shadow-lg',
        }
      );
    } catch (error) {
      toast.error(
        <div className='flex items-center'>
          <img
            src='public\assets\img\images\faq_shape03.png'
            // public\logo_light.png
            alt='Error'
            className='w-6 h-6 mr-2'
          />
          <span>Error sending password reset email.</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'bg-red-600 text-white text-sm font-medium rounded shadow-lg',
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-login bg-cover h-screen'>
      <Helmet prioritizeSeoTags>
        <meta name='description' content='Forgot Password.' />
        <meta property='og:type' content='website' />
        <title>Forgot Password</title>
        <link rel='canonical' href='https://tradetab.com/forgot-password' />
        <meta property='og:title' content='Forgot Password' />
      </Helmet>
      <header className='h-20 bg-slate-900/80 flex justify-between items-center px-2 md:px-20'>
        <div className='ml-2'>
          <Link to='/'>
            <img className=' w-48' src='/logo-lockup.png' alt='Logo' />
          </Link>
        </div>
        <div className='flex items-right gap-10 mr-6'>
          <p className='text-white'>Help</p>
          <p className='text-white'>Contact Us</p>
        </div>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 md:mx-20 py-10 mx-2 gap-8 font-poppins text-[#E6E6E6] leading-tight'>
        <div className='col-span-1 items-center justify-center my-auto mx-2'>
          <h1 className='font-bold md:text-5xl text-3xl'>Forgot Your Password?</h1>
          <p className='text-lg text-white mt-4'>
            Enter your email address below and we'll send you instructions on how to reset your
            password.
          </p>
        </div>
        <div className='bg-slate-900/80 py-8 px-10 rounded-2xl col-span-1 mx-2'>
          <div className='flex justify-center mb-6'>
            <Link to='/'>
              <img className='w-52' src='/logo-lockup.png' alt='Logo' />
            </Link>
          </div>

          <p className='text-white text-sm'>Email Address</p>
          <div className='relative'>
            <img
              src='/assets/img/icon/email.svg'
              alt='Email logo'
              className='absolute xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 xl:bottom-[19%] 2xl:bottom-[13%] left-[3%]'
            />
            <input
              type='email'
              className='w-full xl:text-sm 2xl:text-base xl:h-8 2xl:h-[unset] rounded-md pl-12 text-black'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className={`flex items-center mt-4 gap-2 justify-center bg-[#20DD8A] hover:bg-green-500 hover:border-4 border-none text-black text-lg w-full py-2 rounded-md font-poppins`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Send Instructions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
