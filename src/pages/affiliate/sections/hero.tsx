// import { WalletIcon } from '@heroicons/react/24/outline';

export const Hero = ({ logo }: { logo: string }) => {
  return (
    <div
      // className='relative px-4 z-30 pt-20 mx-auto lg:py-32 md:px-8 xl:px-20 sm:max-w-xl md:max-w-full bg-cover bg-center'
      className='relative px-4 z-30 pt-10 mx-auto lg:py-12 md:px-8 xl:px-20 sm:max-w-xl md:max-w-full bg-cover bg-center'
      style={{ backgroundImage: "url('/affiliate/colorbg.jpg')" }}
    >
      <div className='max-w-xl mx-auto lg:max-w-screen-xl'>
        <div className='mb-8 lg:max-w-lg lg:mb-0'>
          <div className='max-w-xl '>
            <div>
              <h1 className='inline-block px-3 py-px mb-4 text-lg text-white font-semibold'>
                Join our affiliate program today
              </h1>
            </div>
            <h2 className='max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white md:text-5xl leading-none'>
              Get up to $1,350 CPA
            </h2>
            <p className='inline-block px-3 text-slate-300 -mt-4  mb-8 text-lg font-semibold'>
              per qualified client*
            </p>
            <div className='items-center'>
              <a
                href='/'
                className='items-center text-2xl justify-center h-12 py-3 px-6 mr-6 font-medium text-center text-white transition duration-200 rounded-full shadow-md bg-teal-600 hover:bg-teal-400'
              >
                Join Now
              </a>
            </div>
            <p className='text-base text-gray-200 mt-10 md:text-base md:max-w-md'>
              *A qualified client is a trader who makes a first-time deposit of at least $100 and
              generates $40 in spreads revenues for ActivTrades within 180 days of making the
              deposit.
            </p>
          </div>
        </div>
      </div>

      <div className='flex justify-center h-full overflow-x-visible overflow-y-visible lg:w-2/3 xl:w-1/2 lg:absolute lg:justify-start lg:bottom-0 lg:right-0 lg:items-end z-40'>
        <div className='relative'>
          <img
            className='threeD-effect object-contain p-4  lg:ml-8 xl:-ml-4 md:mb-1 w-3/5'
            // src='/affiliate/ipad.png'
            src={logo ? logo : '/affiliate/ipad.png'}
            alt=''
          />

        </div>
      </div>
    </div>
  );
};
