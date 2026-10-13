import { Outlet } from 'react-router-dom';
import { useMemo, memo } from 'react';
import Navbar from '../header/Navbar';
import AdvertasingSpaceBrokers from '../../pages/brokersRatings/single/advertasingSpace/AdvertasingSpaceBrokers';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext';
import ConnectMetaTraderAccount from '../connectMetaTraderAccount/ConnectMetaTraderAccount';
import JoinOurFreeTelegram from '../JoinOurFreeTelegram';
import ConnectionBanner from '../notifications/ConnectionBanner';
import Toast from '../notifications/Toast';
import { useNotifications } from '@/context/NotificationContext';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import { useShouldShowOnboarding } from '@/hook/useShouldShowOnboarding';
import { useModeRedirect } from '@/hook/useModeRedirect';

const Layout = memo(function Layout({ children, personalBanner = false }: any) {
  const { accounts, accountsLoading, isInitialized } = useMTAccounts();
  const shouldShowOnboarding = useShouldShowOnboarding();

  // Handle redirects when mode changes
  useModeRedirect();
  // Memoize displayAds to avoid recalculating on every render
  const displayAds = useMemo(() => (import.meta.env.VITE_DISPLAY_ADS == 'true' ? true : false), []);

  const { notifications, unreadCount } = useNotifications();

  // Memoize hasNotifications to avoid recalculating
  const hasNotifications = useMemo(
    () => notifications && notifications.length > 0,
    [notifications]
  );

  // Memoize accountsLength to avoid recalculating
  const accountsLength = useMemo(() => accounts.length, [accounts.length]);

  // Show full-page loading skeleton during initial load to prevent multiple renders
  if (accountsLoading && !isInitialized) {
    return (
      <div className='layout-wrapper bg-slate-950 w-full text-white relative min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500'></div>
          <p className='text-gray-400 text-sm'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='layout-wrapper bg-slate-950  w-full text-white relative min-h-screen'>
      {/* Onboarding Flow - Shows when user has no accounts */}
      {shouldShowOnboarding && <OnboardingFlow />}

      <Navbar
        displayPaddingTop={accountsLength < 1}
        accountsLoading={accountsLoading}
        unreadCount={unreadCount}
      />

      {/* Connection Banner - Shows active connections and notifications */}
      {hasNotifications && <ConnectionBanner />}

      {/* Toast Notifications */}
      <Toast />
      <div
        className={`grid ${displayAds ? 'grid-cols-10' : 'grid-cols-1'} gap-1 lg:px-4  lg:pt-0 `}
      >
        {/* Left Aside - hidden on small screens */}
        {displayAds && (
          <aside className='col-span-1 hidden lg:block sticky'>
            {!personalBanner ? (
              <AdvertasingSpaceBrokers />
            ) : (
              <img
                className='sticky top-4 md:col-span-1 border max-h-full border-teal-500 bg-gradient-to-t shadow-xl from-teal-500 via-teal-500 to-sky-800 rounded-2xl hidden lg:block'
                src='/assets/img/banner/ads_2.png'
              />
            )}
          </aside>
        )}

        {/* Main Content */}
        <main className={`lg:col-span-8 col-span-12 lg:p-1 `}>
          <Outlet />
          {children}
        </main>

        {/* Right Aside - hidden on small screens */}
        {displayAds && (
          <aside className='col-span-1  lg:block sticky top-4'>
            {!personalBanner ? (
              <AdvertasingSpaceBrokers />
            ) : (
              <img
                className='sticky top-4 md:col-span-1 border max-h-full border-teal-500 bg-gradient-to-t shadow-xl from-teal-500 via-teal-500 to-sky-800 rounded-2xl hidden lg:block'
                src='/assets/img/banner/ads_2.png'
              />
            )}
          </aside>
        )}
      </div>

      <ConnectMetaTraderAccount />

      <JoinOurFreeTelegram
        telegramLink='https://t.me/tradetabteam'
        text='Contact'
        className='fixed w-fit flex bottom-1  md:left-3 right-1 z-50 p-1 rounded-full'
      />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
