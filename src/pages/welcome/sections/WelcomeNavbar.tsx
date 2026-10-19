import ComunicationPoints from '@/component/ui/ComunicationPoints';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { BiRegistered, BiUser } from 'react-icons/bi';
import { FaBars, FaXmark } from 'react-icons/fa6';

const navigation =
  import.meta.env.VITE_STAGIN_MODE == '1'
    ? [
        { name: 'Home', href: '/', current: true },
        { name: 'About Us', href: '#about', current: false },
        { name: 'Features', href: '#whychoose', current: false },
        { name: 'FAQs', href: '#faq', current: false },
      ]
    : [
        { name: 'Home', href: '/', current: true },
        { name: 'Metrics', href: '/metrics', current: false },
        { name: 'Journal', href: '/journal', current: false },
        // { name: 'Predictions', href: '/predictions', current: false },
        { name: 'Forex Calculator', href: '/forexCalculator', current: false },
        // { name: 'Brokers', href: '/brokers', current: false },
        { name: 'Free University', href: '/university', current: false },
        // { name: 'Broker Complaints', href: '/brokersComplaints', current: false },
      ];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function WelcomeNavbar() {
  return (
    <Disclosure as='nav' className=''>
      <div
        className={`fixed top-0 z-50 w-full  md:bg-transparent backdrop-blur-lg transition-colors screens-640:h-[10rem] screens-1200:h-20 duration-300`}
      >
        <div className='mx-auto max-w-full px-2 lg:px-11 py-2 h-full'>
          <div className='flex h-16 md:h-min lg:h-16 screens-640:flex-col screens-1200:flex-row lg:items-center md:justify-between'>
            <div className=' inset-y-0 left-0 flex items-center sm:hidden'>
              {/* Mobile menu button */}
              <DisclosureButton className='group inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                <span className=' -inset-0.5' />
                <span className='sr-only'>Open main menu</span>
                <FaBars aria-hidden='true' className='block h-6 w-6 group-data-[open]:hidden' />
                <FaXmark aria-hidden='true' className='hidden h-6 w-6 group-data-[open]:block' />
              </DisclosureButton>
            </div>

            <div className='flex items-center justify-center md:justify-between screens-1200:justify-normal sm:items-stretch sm:justify-start w-full'>
              <div className='flex flex-shrink-0 items-center mr-5'>
                <a href='/'>
                  <img alt='Trade Tab' src='/logo-lockup.png' className='h-8 w-auto' />
                </a>
              </div>
              <div className='screens-1200:hidden'>
                <ComunicationPoints />
              </div>
            </div>

            <div className='flex justify-start'>
              <div className='hidden px-8 lg:px-0 sm:ml-6  sm:block w-fit border border-slate-300/20 rounded-full mt-1'>
                <div className='flex space-x-4'>
                  {navigation.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? ' text-white' : 'text-gray-300 ',
                        'rounded-md px-[13px] py-2 text-md font-medium whitespace-nowrap'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex justify-center lg:justify-start gap-5 md:gap-0 lg:gap-3 mt-2 screens-1200:mt-0'>
              <div className=' inset-y-0 right-0 md:flex items-center pr-2 sm:static sm:inset-auto sm:ml-3 sm:pr-0 hidden sm:block '>
                <a href='/login'>
                  <button
                    type='button'
                    className='justify-center my-auto items-center px-4 flex rounded-full border hover:scale-110 hover:border-green-700 bg-gray-800 p-1 text-gray-400 '
                  >
                    <BiUser aria-hidden='true' className='h-5 w-5  ' />
                    <p className='ml-2 text-slate-200'>Login</p>
                  </button>
                </a>
              </div>

              <div className='inset-y-0 right-0 md:flex items-center pr-2 sm:static sm:inset-auto sm:ml-3 screens-1200:ml-0 sm:pr-0 hidden sm:block '>
                <a href='/signup'>
                  <button
                    type='button'
                    className='justify-center my-auto items-center px-4 flex rounded-full hover:scale-110 border-2 border-teal-600 hover:border-green-700 bg-gray-800 p-1 text-gray-400 '
                  >
                    <BiRegistered aria-hidden='true' className='h-5 w-5  ' />
                    <p className='ml-2 text-slate-200 text-nowrap'>Register For Free</p>
                  </button>
                </a>
              </div>
              <div className='hidden screens-1200:block'>
                <ComunicationPoints />
              </div>
            </div>
          </div>
        </div>
        <DisclosurePanel className='sm:hidden backdrop-blur-md '>
          <div className='space-y-1 px-2 pb-3 pt-2'>
            {navigation.map(item => (
              <DisclosureButton
                key={item.name}
                as='a'
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:text-green-600 ',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>

          <div className=' inset-y-0 right-0 md:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 pl-4 pb-6 '>
            <a href='/login'>
              <button
                type='button'
                className=' justify-center my-auto items-center px-4 flex rounded-full border hover:scale-110 hover:border-green-700 bg-gray-800 p-1 text-gray-400 '
              >
                <BiUser aria-hidden='true' className='h-5 w-5  ' />
                <p className='ml-2 text-slate-200'>Login</p>
              </button>
            </a>
          </div>

          <div className=' inset-y-0 right-0 md:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 pl-4 pb-6 '>
            <a href='/signup'>
              <button
                type='button'
                className=' justify-center my-auto items-center px-4 flex rounded-full border hover:scale-110 hover:border-green-700 bg-gray-800 p-1 text-gray-400 '
              >
                <BiRegistered aria-hidden='true' className='h-5 w-5  ' />
                <p className='ml-2 text-slate-200'>Register</p>
              </button>
            </a>
          </div>
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
}
