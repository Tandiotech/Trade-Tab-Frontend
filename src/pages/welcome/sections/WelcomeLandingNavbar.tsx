import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { FaTelegram } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OFFICIAL_TELEGRAM } from '@/utils/GlobalVars';

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Metrics', to: '/metrics' },
  { name: 'Journal', to: '/journal' },
  { name: 'Brokers', to: '/brokers' },
  { name: 'Free University', to: '/university' },
  { name: 'Calculators', to: '/forexCalculator' },
] as const;

/** Navbar styled for the redesigned welcome/landing page only. */
export default function WelcomeLandingNavbar() {
  const { pathname } = useLocation();

  return (
    <Disclosure as='div' className='tt-lp-nav'>
      <nav className='tt-nav'>
        <Link to='/' className='tt-brand no-underline'>
          <img src='/logo_1.png' alt='TradeTab' className='tt-logo-img' />
          <span className='tt-wordmark'>TradeTab</span>
        </Link>

        <div className='tt-navlinks'>
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.to}
              className={
                pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to)) ? 'active' : ''
              }
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className='tt-navright'>
          <Link to='/login' className='tt-btn tt-btn-ghost'>
            Sign in
          </Link>
          <Link to='/signup' className='tt-btn tt-btn-green'>
            Add account <ArrowRight size={16} />
          </Link>
          <a
            href={OFFICIAL_TELEGRAM}
            target='_blank'
            rel='noopener noreferrer'
            className='tt-icon-btn'
            aria-label='Telegram'
          >
            <FaTelegram size={18} />
          </a>

          <DisclosureButton className='tt-mobile-menu lg:hidden' aria-label='Menu'>
            <FaBars className='block h-5 w-5 ui-open:hidden' />
            <FaXmark className='hidden h-5 w-5 ui-open:block' />
          </DisclosureButton>
        </div>
      </nav>

      <DisclosurePanel className='tt-mobile-panel lg:hidden'>
        <div className='tt-mobile-links'>
          {navigation.map(item => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.to}
              className={pathname === item.to ? 'active' : ''}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
        <div className='tt-mobile-actions'>
          <DisclosureButton as={Link} to='/login' className='tt-btn tt-btn-ghost'>
            Sign in
          </DisclosureButton>
          <DisclosureButton as={Link} to='/signup' className='tt-btn tt-btn-green'>
            Add account <ArrowRight size={16} />
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
