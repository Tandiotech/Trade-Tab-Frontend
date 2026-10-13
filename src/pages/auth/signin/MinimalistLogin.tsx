import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../utils/GlobalVars';
import { RUTE_USER_LOGIN } from '../../../utils/Rutes';
import Loading2 from '../../../component/loader/Loading2/Loading2';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginForm {
  email: string;
  password: string;
  name: string;
  location: string;
}

function MinimalistLogin() {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onValid = async (data: LoginForm) => {
    const loginEndpoint = `${BACKEND_URL}${RUTE_USER_LOGIN}`;
    const sessionName = import.meta.env.VITE_SESSION_NAME;
    const loadingWaitTime = import.meta.env.VITE_LOADING_WAIT;

    try {
      const response = await axios.post(loginEndpoint, {
        email: data.email,
        password: data.password,
        name: data.name,
        location: data.location,
      });

      if (response.status !== 200) {
        throw new Error('Error en la solicitud: ' + response.status);
      }

      toast.success('Login successful');

      const sessionData = {
        token: response.data.token,
        email: data.email,
        admin: response.data.admin,
      };

      sessionStorage.setItem(sessionName, JSON.stringify(sessionData));

      setTimeout(() => {
        window.location.href = '/accounts';
      }, loadingWaitTime);
    } catch (error: any) {
      console.error('Login request failed:', error);

      if (error.response && error.response.status === 400) {
        toast.error('Lack of information to proceed. Please verify your details.');
        return;
      }

      toast.error('There was an error in the request. Please try again.');
    }
  };

  const onInvalid = () => {
    setTimeout(() => {
      clearErrors();
    }, 2000);
  };

  const onSubmit = handleSubmit(onValid, onInvalid);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='bg-login bg-cover h-screen'>
      <header className='h-16 bg-slate-900/80 flex justify-between items-center px-4'>
        <Link to='/'>
          <img className='w-32' src='/logo_light.png' alt='Logo' />
        </Link>
      </header>

      <div className='flex flex-col items-center justify-center h-screen font-poppins text-[#E6E6E6]'>
        <div className='bg-slate-900/80 py-6 px-8 rounded-lg w-full max-w-md'>
          <h2 className='text-white text-2xl font-bold mb-6 text-center whitespace-nowrap'>
            Register to Connect Account
          </h2>

          <form onSubmit={onSubmit} autoComplete='off'>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-xs text-white mb-2'>
                Name
              </label>
              <input
                type='text'
                id='name'
                autoComplete='off'
                className='w-full text-black px-4 py-2 rounded-md'
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className='mt-1 text-red-600'>{errors.name.message}</p>}
            </div>

            <div className='mb-4'>
              <label htmlFor='email' className='block text-xs text-white mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                autoComplete='off'
                className='w-full text-black px-4 py-2 rounded-md'
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className='mt-1 text-red-600'>{errors.email.message}</p>}
            </div>

            <div className='mb-4'>
              <label htmlFor='location' className='block text-xs text-white mb-2'>
                Location
              </label>
              <input
                type='text'
                id='location'
                autoComplete='off'
                className='w-full text-black px-4 py-2 rounded-md'
                {...register('location', { required: 'Location is required' })}
              />
              {errors.location && <p className='mt-1 text-red-600'>{errors.location.message}</p>}
            </div>

            <div className='mb-6'>
              <label htmlFor='password' className='block text-xs text-white mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                autoComplete='new-password'
                className='w-full text-black px-4 py-2 rounded-md'
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className='mt-1 text-red-600'>{errors.password.message}</p>}
            </div>

            <button
              type='submit'
              className='w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500 duration-300'
            >
              {isSubmitting ? <Loading2 className='pt-0' /> : 'Login'}
            </button>
          </form>

          <div className='flex justify-between items-center my-3'>
            <div className='h-2 divide-white divide-y-2'></div>
            <p className='text-white'>Or</p>
            <div className='h-2 divide-white divide-y-2'></div>
          </div>

          <div className='w-full'>
            <GoogleLoginButton finalRoute='/accounts'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimalistLogin;
