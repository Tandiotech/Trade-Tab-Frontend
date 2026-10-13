export const Rates = () => {
  return (
    <div className='relative w-full h-full bg-teal-600'>
      <div className='absolute hidden w-full bg-slate-100 lg:block h-96' />
      <div className='relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'>
        <div className='max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12'>
          <h2 className='max-w-lg  mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-white md:text-gray-900 sm:text-4xl md:mx-auto'>
            Our rates are based on your traders’ country of residence
          </h2>
        </div>
        <div className='grid max-w-7xl gap-10 md:grid-cols-3 sm:mx-auto'>
          <div className='h-full flex flex-col'>
            <div className='p-8 bg-gray-900 rounded flex-grow'>
              <div className='mb-4 text-center'>
                <p className='text-xl font-medium tracking-wide text-white'>Tier 1</p>
                <div className=' items-center justify-center'>
                  <p className='mr-2 text-5xl font-semibold text-white lg:text-6xl'>$1,000</p>
                  <p className='text-lg text-gray-500'>CPA Countries</p>
                </div>
              </div>
              <ul className='mb-8 space-y-2'>
                <li className='flex items-center'>
                  <p className='font-medium text-gray-300'>
                    Germany, Netherlands, United Kingdom, France, Italy, Norway, Sweden, Austria,
                    Australia, Belgium, New Zealand, Switzerland, Denmark, Luxembourg, Ireland, Hong
                    Kong, Kuwait, Saudi Arabia, United Arab Emirates, Singapore, Qatar
                  </p>
                </li>
              </ul>
            </div>
            <div className='w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75' />
            <div className='w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50' />
            <div className='w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25' />
          </div>

          <div className='h-full flex flex-col'>
            <div className='p-8 bg-gray-900 rounded flex-grow'>
              <div className='mb-4 text-center'>
                <p className='text-xl font-medium tracking-wide text-white'>Tier 2</p>
                <div className=' items-center justify-center'>
                  <p className='mr-2 text-5xl font-semibold text-white lg:text-6xl'>$750</p>
                  <p className='text-lg text-gray-500'>CPA Countries</p>
                </div>
              </div>
              <ul className='mb-8 space-y-2'>
                <li className='flex items-center'>
                  <p className='font-medium text-gray-300'>
                    South Africa, Finland, Israel, Cyprus, Poland, Bulgaria, Greece, Malta, Romania,
                    Slovakia, Croatia, Czech Republic, Hungary, Albania, Argentina, Chile, China,
                    Costa Rica, Estonia, Iceland, India, Latvia, Lithuania, Malaysia, Mexico,
                    Slovenia, Taiwan, Uruguay, Turkey, Republic of Korea
                  </p>
                </li>
              </ul>
            </div>
            <div className='w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75' />
            <div className='w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50' />
            <div className='w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25' />
          </div>

          <div className='h-full flex flex-col'>
            <div className='p-8 bg-gray-900 rounded flex-grow'>
              <div className='mb-4 text-center'>
                <p className='text-xl font-medium tracking-wide text-white'>Tier 3</p>
                <div className=' items-center justify-center'>
                  <p className='mr-2 text-5xl font-semibold text-white lg:text-6xl'>$500</p>
                  <p className='text-lg text-gray-500'>CPA Countries</p>
                </div>
              </div>
              <ul className='mb-8 space-y-2'>
                <li className='flex items-center'>
                  <p className='font-medium text-gray-300'>
                    All other countries not listed in Tier 1 or Tier 2.
                  </p>
                </li>
              </ul>
            </div>
            <div className='w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75' />
            <div className='w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50' />
            <div className='w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25' />
          </div>
        </div>
      </div>
    </div>
  );
};
