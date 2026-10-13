import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { http } from '../../../utils/http_request';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await http.post(`auth/reset-password/${token}`, { password });
      setMessage('Password updated successfully.');
    } catch (error: any) {
      setMessage('Error updating the password.');
      toast.error(error.response.data);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4'>
      <div className='max-w-md w-full bg-darkblack-700 text-white rounded-lg shadow-lg p-6'>
        <h2 className='text-3xl font-bold text-center text-[#02C686] mb-6'>Reset Your Password</h2>
        <p className='text-gray-400 text-center mb-4'>
          Enter a new password to reset your account.
        </p>
        <form onSubmit={handleSubmit} className='space-y-6' autoComplete='off'>
          <div>
            <label className='block text-lg font-medium text-gray-300 mb-2' htmlFor='password'>
              New Password
            </label>
            <input
              type='password'
              id='password'
              autoComplete='new-password'
              placeholder='Enter your new password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='w-full p-3 bg-darkblack-800 border border-gray-600 rounded-lg shadow-sm focus:ring-[#02C686] focus:border-[#02C686]'
            />
          </div>
          <button
            type='submit'
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#02C686] hover:bg-[#00b377]'
            } text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Reset Password'}
          </button>
        </form>
        {message && (
          <p
            className={`text-center mt-4 ${
              message.includes('successfully') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
        <div className='flex justify-center mt-6'>
          <Link
            className='px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300'
            to={'/'}
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
