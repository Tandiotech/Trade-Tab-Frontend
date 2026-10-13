import { ArrowsPointingOutIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { BsWindowDesktop } from 'react-icons/bs';

export const Benefits = () => {
  return (
    <div className='bg-slate-100 w-full'>
      <div className='relative px-4 py-16 mx-auto sm:max-w-xl  md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-32 z-10'>
        <h2 className='font-sans text-center mb-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none'>
          To whom we can help
        </h2>
        <div className='grid gap-8 row-gap-5 lg:grid-cols-3'>
          <div className='relative p-px overflow-hidden transition duration-300 transform border rounded-3xl shadow-sm hover:scale-105 group hover:shadow-xl'>
            <div className='absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100' />
            <div className='absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100' />
            <div className='absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100' />
            <div className='absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100' />
            <div className='relative p-5 bg-white rounded-sm'>
              <div className=' flex-col mb-2 lg:items-center lg:flex-row'>
                <div className='flex items-center justify-center w-24 h-24 mb-4 mr-2 rounded-full lg:mb-0'>
                  <ArrowsPointingOutIcon className='text-teal-500 h-16 w-16' />
                </div>
                <h6 className='my-8 font-bold text-slate-800 text-3xl leading-8'>
                  Owner of a traffic generating source?
                </h6>
              </div>
              <hr className='border-t-2 border-teal-500'></hr>
              <p className='mb-2 text-xl font-semibold text-gray-500 my-4'>
                Do you have a website, forum, social network group, YouTube channel, mobile app?
              </p>
            </div>
          </div>
          <div className='relative p-px overflow-hidden transition duration-300 transform border rounded-3xl shadow-sm hover:scale-105 group hover:shadow-xl'>
            <div className='absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100' />
            <div className='absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100' />
            <div className='absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100' />
            <div className='absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100' />
            <div className='relative p-5 bg-white rounded-sm'>
              <div className=' flex-col mb-2 lg:items-center lg:flex-row'>
                <div className='flex items-center justify-center w-24 h-24 mb-4 mr-2 rounded-full lg:mb-0'>
                  <ChartPieIcon className='text-teal-500 h-16 w-16' />
                </div>
                <h6 className='my-8 font-bold text-slate-800 text-3xl leading-8'>
                  Provider of trading-related services?
                </h6>
              </div>
              <hr className='border-t-2 border-teal-500'></hr>
              <p className='mb-2 text-xl font-semibold text-gray-500 my-4'>
                Do you provide trading education, coaching, webinars, market analysis, etc?
              </p>
            </div>
          </div>
          <div className='relative p-px overflow-hidden transition duration-300 transform border rounded-3xl shadow-sm hover:scale-105 group hover:shadow-xl'>
            <div className='absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100' />
            <div className='absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100' />
            <div className='absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100' />
            <div className='absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100' />
            <div className='relative p-5 bg-white rounded-sm'>
              <div className=' flex-col mb-2 lg:items-center lg:flex-row'>
                <div className='flex items-center justify-center w-24 h-24 mb-4 mr-2 rounded-full lg:mb-0'>
                  <BsWindowDesktop className='text-teal-500 h-16 w-16' />
                </div>
                <h6 className='my-8 font-bold text-slate-800 text-3xl leading-8'>
                  Web-traffic buying specialist?
                </h6>
              </div>
              <hr className='border-t-2 border-teal-500'></hr>
              <p className='mb-2 text-xl font-semibold text-gray-500 my-4'>
                Can forward traffic to our platform through ad networks or other sources?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
