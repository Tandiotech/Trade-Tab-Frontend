import { useState } from 'react';

interface ItemProps {
  title: string;
  children: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b border-teal-300'>
      <button
        type='button'
        aria-label='Open item'
        title='Open item'
        className='flex items-center  justify-between w-full p-4 focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className='text-lg text-white font-medium'>{title}</p>
        <svg
          viewBox='0 0 24 24'
          className={`w-3 text-teal-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <polyline
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeMiterlimit='10'
            points='2,7 12,17 22,7'
            strokeLinejoin='round'
          />
        </svg>
      </button>
      {isOpen && (
        <div className='p-4  pt-0'>
          <p className='text-teal-400'>{children}</p>
        </div>
      )}
    </div>
  );
};

export const FaqArea = () => {
  return (
    <div className='bg-black relative'>
      <div className='glow-circle-left '></div>
      <div className='px-4 py-16 mx-auto max-w-screen-2xl md:px-24 lg:px-8 lg:py-20 '>
        <div className=' max-w-screen-xl mx-auto '>
          <div className='max-w-screen-xl mb-10 md:mx-auto sm:text-center  md:mb-12'>
            <div className='mx-auto text-center'>
              <p className='inline-block px-3 py-px mb-4 text-xs font-semibold   text-teal-900 uppercase rounded-full bg-teal-400'>
                Got any doubts?
              </p>
            </div>
            <p className='mb-6  md:text-5xl text-4xl font-bold leading-none  text-white text-center  md:mx-auto'>
              Frequently asked questions
            </p>
            <p className='text-base text-gray-400 md:text-lg '>
              We are here to answer all your questions and concerns.
            </p>
          </div>
          <div className='space-y-4 '>
            <Item title='Do I need to install any software to use TradeTab?'>
              TradeTab is a fully web-based platform, accessible from any device with an internet
              connection. There is no need to install any software on your computer or mobile
              device.
            </Item>
            <Item title='How secure is my data on TradeTab?'>
              TradeTab uses industry-standard encryption and security protocols to ensure that your
              data is protected. We prioritize your privacy and data security at all times.
            </Item>
            <Item title='How can I track my trading performance on TradeTab?'>
              TradeTab provides comprehensive analytics and performance tracking tools. You can view
              detailed reports on your trades, profits, losses, and various trading metrics to help
              you make informed decisions.
            </Item>
            <Item title='Is TradeTab beginner-friendly?'>
              Definitely! TradeTab is tailored to be easy to use for traders of all skill levels. We
              recommend that beginners start their trading journey on the platform for optimal
              success.
            </Item>
            <Item title='Can I connect multiple broker accounts to TradeTab?'>
              Yes, TradeTab allows you to connect and manage multiple broker accounts from a single
              platform. This makes it easy to monitor and analyze your trades across different
              brokers.
            </Item>
            <Item title='Does TradeTab offer real-time market data?'>
              Yes, TradeTab provides real-time market data and updates, ensuring that you have the
              latest information to make informed trading decisions.
            </Item>
          </div>
        </div>
      </div>
    </div>
  );
};
