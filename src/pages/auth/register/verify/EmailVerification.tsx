import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '@/utils/http_request';

const EmailVerification = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true; // Flag para controlar la ejecución

    const verifyEmail = async () => {
      try {

        const response = await http.get(`auth/verify-email/${token}`); // Cambiado a GET

        if (isMounted) {
          setStatus('success');
        }
      } catch (error) {
        console.error('Verification Error:', error);
        if (isMounted) {
          setStatus('error');
        }
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }

    return () => {
      isMounted = false; // Evitar que se actualice el estado si el componente se desmonta
    };
  }, [token]);

  return (
    <div className='min-h-screen bg-slate-900 flex flex-col items-center justify-center'>
      <h1 className='text-white text-3xl mb-4'>
        {status === 'loading' && 'Verifying Email...'}
        {status === 'success' && 'Email Verified Successfully!'}
        {status === 'error' && 'Email Verification Failed.'}
      </h1>
      {status === 'success' && (
        <a href='/login' className='text-teal-500 underline'>
          Go to Login
        </a>
      )}
    </div>
  );
};

export default EmailVerification;
