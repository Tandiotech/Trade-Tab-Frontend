import {
  BsCalendar2Check,
  BsHeadset,
  BsShieldCheck,
  BsSlashCircle,
  BsTrophy,
  BsWallet,
} from 'react-icons/bs';

export const Features = () => {
  return (
    <div className='bg-slate-100'>
      <div className='px-4  py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'>
        <h2 className='max-w-xl mx-auto text-center mb-14 font-sans text-3xl mt-6 font-bold tracking-tight text-gray-800 sm:text-4xl sm:leading-none'>
          What makes us the first choice of affiliates around the world?
        </h2>
        <div className='grid row-gap-0 md:row-gap-12  grid-cols-2 lg:grid-cols-3'>
          <div className='p-4 md:p-12  border-b sm:border-r'>
            <div className='max-w-md flex flex-col items-center justify-center text-center mx-auto'>
              <BsCalendar2Check className='w-16 h-16 text-teal-500' />
              <h6 className='mt-4 text-xl font-semibold text-slate-800 leading-5'>
                Timely monthly payments
              </h6>
            </div>
          </div>
          <div className='p-4 md:p-12  border-b lg:border-r'>
            <div className='max-w-md flex flex-col items-center justify-center text-center mx-auto'>
              <BsWallet className='w-16 h-16 text-teal-500' />
              <h6 className='mt-4 text-xl font-semibold text-slate-800 leading-5'>
                No limits on commision
              </h6>
            </div>
          </div>
          <div className='p-4 md:p-12  border-b sm:border-r lg:border-r-0'>
            <div className='max-w-md flex flex-col items-center justify-center text-center mx-auto'>
              <BsSlashCircle className='w-16 h-16 text-teal-500' />
              <h6 className='mt-4 text-xl font-semibold text-slate-800 leading-5'>
                No set-up costs
              </h6>
            </div>
          </div>
          <div className='p-4 md:p-12  border-b lg:border-b-0 lg:border-r'>
            <div className='max-w-md flex flex-col items-center justify-center text-center mx-auto'>
              <BsShieldCheck className='w-16 h-16 text-teal-500' />
              <h6 className='mt-4 text-xl font-semibold text-slate-800 leading-5'>
                Multi-regulated broker
              </h6>
            </div>
          </div>
          <div className='p-4 md:p-12  border-b sm:border-b-0 sm:border-r'>
            <div className='max-w-md flex flex-col items-center justify-center text-center mx-auto'>
              <BsTrophy className='w-16 h-16 text-teal-500' />
              <h6 className='mt-4 text-xl font-semibold text-slate-800 leading-5'>
                Trusted broker since 2001
              </h6>
            </div>
          </div>
          <div className='p-4 md:p-12 '>
            <div className='max-w-md flex flex-col items-center justify-center text-center mx-auto'>
              <BsHeadset className='w-16 h-16 text-teal-500' />
              <h6 className='mt-4 text-xl font-semibold text-slate-800 leading-5'>
                Personal Account Manager
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
