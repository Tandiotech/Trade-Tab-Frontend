import { BiCheckShield, BiMoneyWithdraw } from 'react-icons/bi';
import { BsSafe } from 'react-icons/bs';

export const Secure = () => {
  return (
    <div className='px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='col-span-1 text-left'>
          <div className='max-w-xl mb-10 md:mx-auto text-center md:text-left lg:max-w-2xl md:mb-12'>
            <h2 className='max-w-lg mb-6 lg:max-w-md font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl '>
              Keeping your trades safe and secure
            </h2>
          </div>
          <div className='grid gap-8 mb-8 md:row-gap-8 md:grid-cols-3 grid-cols-2'>
            <div className='duration-300 transform bg-teal-600 rounded-2xl hover:-translate-y-2 '>
              <div className='h-full p-4 '>
                <h6 className='mb-2 text-lg text-white leading-7'>Negative balance protection</h6>
                <hr className='border-teal-100 my-4'></hr>
                <BiCheckShield className='h-16 w-16 text-white' />
              </div>
            </div>
            <div className='duration-300 transform bg-teal-600 rounded-2xl hover:-translate-y-2'>
              <div className='h-full p-4 '>
                <h6 className='mb-2 text-lg text-white leading-7'>
                  Segregated and ringfenced client money
                </h6>
                <hr className='border-teal-100 my-4'></hr>
                <BiMoneyWithdraw className='h-16 w-16 text-white' />
              </div>
            </div>
            <div className='duration-300 transform bg-teal-600 rounded-2xl hover:-translate-y-2'>
              <div className='h-full p-4 '>
                <h6 className='mb-2 text-lg text-white leading-7'>
                  Enhanced funds up to $1.000.000
                </h6>
                <hr className='border-teal-100 my-4'></hr>
                <BsSafe className='h-16 w-16 text-white' />
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-1 p-4'>
          <img src='/affiliate/security.webp' className='rounded-3xl' />
        </div>
      </div>
    </div>
  );
};
