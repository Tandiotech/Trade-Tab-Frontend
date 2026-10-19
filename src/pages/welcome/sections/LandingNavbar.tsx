import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';

/** Public (logged-out) nav — marketing pages with real routes only. */
const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Metrics', to: '/metrics' },
  { name: 'Journal', to: '/journal' },
  { name: 'Brokers', to: '/brokers' },
  { name: 'Free University', to: '/university' },
  { name: 'Calculators', to: '/forexCalculator' },
] as const;

export default function LandingNavbar() {
  return (
    <Disclosure as='nav' className='fixed top-0 z-50 w-full'>
      <div className='tt-nav-proto'>
        <div className='tt-nav-proto-inner'>
          <Link to='/' className='flex items-center gap-2.5 font-semibold text-[var(--tt-fg-0)] no-underline'>
            <img src='/logo-lockup.png' alt='TradeTab' className='h-8 w-auto object-contain' />
            <span className='hidden text-[15px] tracking-tight sm:inline'>TradeTab</span>
          </Link>

          <div className='tt-nav-links hidden lg:flex'>
            {navigation.map(item => (
              <Link key={item.name} to={item.to} className='no-underline'>
                {item.name}
              </Link>
            ))}
          </div>

          <div className='hidden items-center gap-2.5 md:flex'>
            <Link to='/login' className='tt-btn tt-btn-sm tt-btn-ghost'>
              Sign in
            </Link>
            <Link to='/signup' className='tt-btn tt-btn-sm tt-btn-primary'>
              Add account <ArrowRight className='h-3.5 w-3.5' />
            </Link>
            <a
              href={OFFICIAL_TELEGRAM}
              target='_blank'
              rel='noopener noreferrer'
              className='tt-btn tt-btn-sm tt-btn-ghost px-3'
              aria-label='Telegram'
            >
              <FaTelegram size={14} />
            </a>
          </div>

          <div className='md:hidden'>
            <DisclosureButton className='inline-flex items-center justify-center rounded-lg border border-[var(--tt-line-2)] bg-[oklch(1_0_0_/0.03)] p-2.5 text-[var(--tt-fg-2)]'>
              <span className='sr-only'>Menu</span>
              <FaBars className='block h-5 w-5 ui-open:hidden' />
              <FaXmark className='hidden h-5 w-5 ui-open:block' />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className='border-b border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] px-4 py-4 md:hidden'>
        <div className='flex flex-col gap-1'>
          {navigation.map(item => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.to}
              className='rounded-lg px-3 py-2.5 text-sm text-[var(--tt-fg-1)] hover:bg-[oklch(1_0_0_/0.04)]'
            >
              {item.name}
            </DisclosureButton>
          ))}
          <div className='mt-3 flex flex-col gap-2 border-t border-[var(--tt-line-1)] pt-3'>
            <DisclosureButton as={Link} to='/login' className='tt-btn tt-btn-sm tt-btn-ghost w-full justify-center'>
              Sign in
            </DisclosureButton>
            <DisclosureButton as={Link} to='/signup' className='tt-btn tt-btn-sm tt-btn-primary w-full justify-center'>
              Add account
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
