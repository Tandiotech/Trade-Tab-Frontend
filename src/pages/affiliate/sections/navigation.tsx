import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'CPA Rates', href: '#rates', current: true },
  { name: 'FAQ', href: '#faqs', current: false },
];

export default function NavigationAffiliate() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setIsScrolled(position > 30); // Cambiamos el estado solo cuando superamos 30px
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Disclosure
      as='nav'
      className={`fixed w-full top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-slate-100 shadow-md text-slate-800' : 'bg-slate-200 text-slate-800 md:bg-transparent'} `}
    >
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 h-64  hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon aria-hidden='true' className='block h-6 w-6 text-slate-600' />
              <XMarkIcon aria-hidden='true' className='hidden h-6 w-6' />
            </DisclosureButton>
          </div>
          <div className='flex flex-1 ml-16 md:ml-0 items-stretch justify-start'>
            <div className='flex flex-shrink-0 items-center'>
              <a href='/affiliate'>
                <img
                  className='h-6 w-auto'
                  src='/logo-lockup.png'
                  alt='Affiliate'
                />
              </a>
            </div>
          </div>

          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            <div className='hidden sm:ml-6 sm:block'>
              <div className='flex space-x-4 '>
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? isScrolled
                          ? 'text-slate-800 hover:text-teal-500 leading tracking-wide'
                          : 'text-white font-orbitron underline underline-offset-8'
                        : isScrolled
                          ? 'text-slate-800 hover:text-teal-500 tracking-wide'
                          : 'text-gray-100 hover:underline hover:underline-offset-8',
                      'rounded-md px-3 font-orbitron font-bold uppercase py-2 text-sm'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <button
              type='button'
              className='rounded-full ml-4 bg-teal-600 tracking-wide px-4 p-1 font-orbitron uppercase text-sm font-semibold hover:bg-teal-500 text-white hover:text-white '
            >
              Join Now
            </button>
          </div>
        </div>
      </div>

      <DisclosurePanel className='sm:hidden'>
        <div className='space-y-1 px-2 pb-3 pt-2'>
          {navigation.map(item => (
            <DisclosureButton
              key={item.name}
              as='a'
              href={item.href}
              className={classNames(
                item.current ? ' text-slate-500' : '  hover:text-slate-800',
                'block rounded-md px-3 font-orbitron py-2 text-base font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
