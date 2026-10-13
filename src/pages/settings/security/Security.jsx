import PasswordChange from '../../../component/forms/PasswordChange/PasswordChange';
import { RiLockPasswordFill } from 'react-icons/ri';

function Security() {
  return (
    <div
      id='tab6'
      className='flex items-center justify-center w-full tab-pane active p-5 rounded-2xl bg-gradient-to-t from-cyan-700 via-transparent to-transparent md:border border-cyan-800 hover:border-cyan-500 ease-in-out duration-300'
    >
      <div className=' flex flex-col px-2 md:px-5 md:py-2'>
        <div className=''>
          <h3 className='text-2xl font-bold text-white mb-5'>Password Management</h3>
          <hr className='opacity-50' />
          <p className='text-white/50 text-sm font-medium text-bgray-50/550'>
            Secure your account with a strong password.
          </p>
        </div>
        <div className='grid grid-cols-3 gap-5 w-full border-yellow-500'>
          <div className=' col-span-3 md:col-span-2 col-start-1 '>
            <PasswordChange />
          </div>
          <div className='md:flex flex-col col-span-3 md:col-auto justify-around items-center h-full'>
            {' '}
            <div className='hidden bg-[#05111D] rounded-full md:flex justify-center items-center w-48 h-48 '>
              <div>
                <img className=' ' src='/assets/padlock.png' alt='' />
              </div>
            </div>
            <div className='text-white'>
              <strong>Security Tips</strong>
              <div className='flex items-center'>
                <div className='w-4 h-4 rounded-full flex items-center justify-center mr-2 bg-green-500'></div>
                <span className='text-sm text-bgray-500 dark:text-darkblack-300'>
                  Change password regularly{' '}
                </span>
              </div>
              <div className='flex items-center'>
                <div className='w-4 h-4 rounded-full flex items-center justify-center mr-2 bg-green-500'></div>
                <span className='text-sm text-bgray-500 dark:text-darkblack-300'>
                  Don’t reused passwords{' '}
                </span>
              </div>
              <div className='flex items-center'>
                <div className='w-4 h-4 rounded-full flex items-center justify-center mr-2 bg-green-500'></div>
                <span className='text-sm text-bgray-500 dark:text-darkblack-300'>
                  Use a password maneger{' '}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;
