import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { http } from '@/utils/http_request';

const Unsubscribe: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    const unsubscribeUser = async () => {
      if (!email) {
        setStatus('error');
        return;
      }

      try {
        await http.post(`/user/unsubscribe`, {
          email: encodeURIComponent(email),
        });
        setStatus('success');
      } catch (err) {
        console.error('Error unsubscribing:', err);
        setStatus('error');
      }
    };

    unsubscribeUser();
  }, [email]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='max-w-md text-center bg-white p-8 rounded shadow'>
        {status === 'pending' && (
          <>
            <h1 className='text-xl font-semibold'>Processing your request...</h1>
            <p>Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className='text-xl font-semibold text-green-600'>You’ve been unsubscribed</h1>
            <p className='mt-2'>
              We're sorry to see you go. You won't receive more emails from us.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className='text-xl font-semibold text-red-600'>Unsubscribe Failed</h1>
            <p className='mt-2'>
              There was an issue processing your request. Please try again later.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
