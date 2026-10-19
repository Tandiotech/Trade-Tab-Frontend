export const Insights = () => {
  return (
    <div className='w-full '>
      <div className='grid  grid-cols-2 '>
        <div className="flex p-20 md:col-span-1 col-span-2 flex-col justify-center xl:pr-0  bg-[url('/affiliate/section1.jpg')] bg-cover bg-center bg-no-repeat w-full">
          <div className='max-w-xl mb-6 py-10 md:w-1/2'>
            <h2 className='max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl sm:leading-none'>
              Dive into your data and get invaluable insights
            </h2>
            <p className='text-base text-gray-200 md:text-lg'>
              Powerful reporting and analytics tools to help you better understand your traders and
              inform your marketing strategy.
            </p>
            <div className='flex items-center py-4 text-slate-200'>
              <p className='text-slate-200'>Powered by</p>
              <img src='/logo-lockup.png' className='ml-2 h-6 ' />
            </div>
          </div>
        </div>
        <div className="flex p-20 md:col-span-1 col-span-2 flex-col justify-center xl:pr-0  bg-[url('/affiliate/section2.jpg')] bg-cover bg-center bg-no-repeat w-full">
          <div className='max-w-xl mb-6 py-10 md:w-1/2'>
            <h2 className='max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl sm:leading-none'>
              Marketing resources that help you reach & engage your audience
            </h2>
            <p className='text-base text-gray-200 md:text-lg'>
              Digital marketing material in multiple languages combined with a marketing platform
              gives you all you need to reach and engage your audience and maximise your CPA
              earnings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
