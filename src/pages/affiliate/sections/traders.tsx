import { SetStateAction, useState } from 'react';

export const Traders = () => {
  const [selectedText, setSelectedText] = useState('This is the default text.');

  const handleButtonClick = (text: SetStateAction<string>) => {
    setSelectedText(text);
  };

  return (
    <div className='relative flex flex-col-reverse px-4 py-16 mx-auto lg:block lg:flex-col lg:py-32 xl:py-48 md:px-8 sm:max-w-xl md:max-w-full'>
      <div className='z-0 flex justify-center h-full -mx-4 overflow-hidden lg:pt-24 lg:pb-16 lg:pr-8 xl:pr-0 lg:w-1/2 lg:absolute lg:justify-end lg:bottom-0 lg:left-0 lg:items-center'>
        <img
          src='/affiliate/metatrader.png'
          className='object-cover object-right w-full h-auto lg:w-auto lg:h-full'
          alt=''
        />
      </div>
      <div className='relative flex justify-end max-w-xl mx-auto xl:pr-32 lg:max-w-screen-xl'>
        <div className='mb-16 lg:pr-5 lg:max-w-lg lg:mb-0'>
          <div className='max-w-xl mb-6'>
            <h2 className='max-w-md mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none'>
              Choice of platforms for every trader
            </h2>
          </div>
          <div className=' mx-auto'>
            <div className='flex space-x-4 mb-4'>
              <button
                onClick={() =>
                  handleButtonClick(
                    'The simple way to trade the markets with ActivTrader and maximise investing potential.'
                  )
                }
                className='px-4 py-2 bg-teal-500 text-white font-semibold rounded-full shadow hover:bg-teal-600 transition'
              >
                ActivTrader
              </button>
              <button
                onClick={() =>
                  handleButtonClick(
                    'MetaTrader 4 the simple way to trade the markets with ActivTrader and maximise investing potential.'
                  )
                }
                className='px-4 py-2 bg-teal-500 text-white font-semibold rounded-full shadow hover:bg-teal-600 transition'
              >
                MT4
              </button>
              <button
                onClick={() =>
                  handleButtonClick(
                    'MetaTrader 5 the simple way to trade the markets with ActivTrader and maximise investing potential.'
                  )
                }
                className='px-4 py-2 bg-teal-500 text-white font-semibold rounded-full shadow hover:bg-teal-600 transition'
              >
                MT5
              </button>
            </div>

            <div className=''>
              <p className='text-gray-700 text-xl'>{selectedText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
