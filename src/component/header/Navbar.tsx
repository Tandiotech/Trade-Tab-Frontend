import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { BiCalculator } from 'react-icons/bi';
const logo = '/logo-lockup.png';
import ProfilePicture from './ProfilePicture';
import getUser from '../../utils/getUser.tsx';
import JoinOurFreeTelegram from '../JoinOurFreeTelegram.tsx';
import NoAccountsHeader from '../layout/NoAccountsHeader.tsx';
import ForexCalculatorModal from '../modals/ForexCalculatorModal.tsx';
import QuickJournalPanel from '../journal/QuickJournalPanel';
import CommandPalette from '../command/CommandPalette';
import { main_menu } from './constants.ts';
import MentorButtonWithModal from '../BtnDespokt/Mentor/MentorButton.tsx';
import { useMode } from '@/context/ModeContext';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import ModeSwitcher from '../ModeSwitcher';

export default function Navbar({
  displayPaddingTop,
  accountsLoading = true,
  unreadCount,
}: {
  displayPaddingTop: boolean;
  accountsLoading?: boolean;
  unreadCount: number;
}) {
  const location = useLocation();
  const { mode, isExampleMode } = useMode();
  const { accounts } = useMTAccounts();
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForexCalculator, setShowForexCalculator] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showJournalPanel, setShowJournalPanel] = useState(false);
  const [showViewsMenu, setShowViewsMenu] = useState(false);
  const [analysisState, setAnalysisState] = useState<{
    timeframe: string;
    aggregation: 'day' | 'week' | 'month';
    view: 'pnl' | 'volume' | 'trades';
    compare: boolean;
    symbol?: string;
  }>({
    timeframe: '1M',
    aggregation: 'week',
    view: 'volume',
    compare: false,
    symbol: undefined,
  });

  const trackClicks = async (data: any) => {
    try {
      const storedClicks = JSON.parse(localStorage.getItem('clicks') || '[]');
      const updatedClicks = [...storedClicks, { data, timestamp: new Date() }];
      localStorage.setItem('clicks', JSON.stringify(updatedClicks));

      const clickThreshold = 10;
      if (updatedClicks.length >= clickThreshold) {
        // await sendClicksToDatabase(updatedClicks);
        localStorage.removeItem('clicks');
      }
    } catch (error) {
      console.error('Error storing clicks: ', error);
    }
  };

  const sendClicksToDatabase = async (clicks: any) => {
    try {
      const response = await fetch('/saveClicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clicks }),
      });
      if (!response.ok) {
        throw new Error('Failed to save clicks');
      }

    } catch (error) {
      console.error('Error sending clicks to database:', error);
    }
  };

  // Flush buffered clicks when tab is hidden (best-effort)
  // useEffect(() => {
  //   const flushClicks = async () => {
  //     try {
  //       const stored = JSON.parse(localStorage.getItem('clicks') || '[]');
  //       if (!stored.length) return;
  //       const payload = JSON.stringify({ clicks: stored });
  //       const blob = new Blob([payload], { type: 'application/json' });
  //       const sent = (navigator as any).sendBeacon
  //         ? (navigator as any).sendBeacon('/saveClicks', blob)
  //         : false;
  //       if (!sent) {
  //         await fetch('/saveClicks', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: payload,
  //         });
  //       }
  //       localStorage.removeItem('clicks');
  //     } catch (_) {
  //       // ignore
  //     }
  //   };
  //   const onVis = () => {
  //     if (document.visibilityState === 'hidden') {
  //       flushClicks();
  //     }
  //   };
  //   document.addEventListener('visibilitychange', onVis);
  //   return () => document.removeEventListener('visibilitychange', onVis);
  // }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isMeta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.getAttribute('contenteditable') === 'true');
      if (isTyping) return;
      if (isMeta && key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
      
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // const handleAnalysisChange = (next: typeof analysisState) => {
  //   setAnalysisState(next);
  //   trackClicks({ event: 'analysis_toolbar.change', ...next });
  // };

  const isActive = (pathname: string) => {
    return location.pathname === pathname
      ? 'text-teal-500 md:border-b border-b-teal-700 text-teal-500'
      : '';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLinkClick = (data: any, hasAccess: boolean) => {
    if (hasAccess) trackClicks(data);
    closeMenu();
  };

  // Check if a navigation item should be enabled
  const isNavItemEnabled = (itemPath: string) => {
    // MT Accounts is always enabled
    if (itemPath === '/accounts') return true;
    
    // If user has accounts, all items are enabled
    if (hasAccounts) return true;
    
    // In example mode, all items are enabled
    if (isExampleMode) return true;
    
    // In real mode without accounts, only MT Accounts is enabled
    return false;
  };

  // Check if current page should show calculator
  const shouldShowCalculator = () => {
    const currentPath = location.pathname;
    return ['/', '/economic-calendar', '/journal', '/predictions'].includes(currentPath);
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full transition-colors duration-300 bg-slate-900/20 backdrop-blur-lg border-b border-slate-700/30 z-50`}
      >
        {displayPaddingTop && !accountsLoading && unreadCount === 0 && !hasAccounts && (
          <div className="px-4 py-2">
            <ModeSwitcher />
          </div>
        )}
        {displayPaddingTop && !accountsLoading && unreadCount === 0 && hasAccounts && <NoAccountsHeader />}

        <div className='flex items-center px-3 sm:px-5 justify-between py-2 sm:py-3'>
          <div className='flex items-center gap-2 sm:gap-4 w-full md:w-fit'>
            {/* Mobile hamburger button - properly aligned */}
            <button
              onClick={toggleMenu}
              className='text-white text-lg lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 flex items-center justify-center'
            >
              {isMenuOpen ? <FaTimes className='w-4 h-4 sm:w-5 sm:h-5' /> : <FaBars className='w-4 h-4 sm:w-5 sm:h-5' />}
            </button>

            {/* Logo - centered on mobile, left-aligned on desktop */}
            <div className='flex-1 flex justify-center md:justify-start'>
              <Link
                onClick={() => trackClicks('METRICS')}
                to='/'
                className='flex items-center justify-center'
              >
                <img src={logo} alt='logo' className='h-7 sm:h-9' />
              </Link>
            </div>
          </div>

          <div className='flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-2.5'>
            {shouldShowCalculator() && (
              <button
                type='button'
                onClick={() => setShowForexCalculator(true)}
                className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-600/80 bg-slate-800/90 text-slate-100 transition hover:border-teal-500/40 hover:bg-slate-700/90 hover:text-white'
                title='Position & pip calculator'
                aria-label='Open forex calculator'
              >
                <BiCalculator className='h-5 w-5' aria-hidden />
              </button>
            )}

            <div className='hidden items-center gap-1 rounded-xl border border-slate-600/50 bg-slate-950/40 p-1 md:flex'>
              <MentorButtonWithModal />
              <JoinOurFreeTelegram compact className='!w-auto' text='TradeTab Telegram' />
            </div>

            {['/', '/journal'].includes(location.pathname) && (
              <div className='relative hidden xs:inline-block'>
                <button
                  onClick={() => setShowViewsMenu(v => !v)}
                  className='px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm'
                  title='Saved Views'
                >
                  Views ▾
                </button>
                {showViewsMenu && (
                  <div className='absolute right-0 mt-2 w-44 bg-slate-900 border border-white/10 rounded-lg shadow-lg z-50'>
                    <button
                      className='w-full text-left px-3 py-2 hover:bg-white/10'
                      onClick={() => {
                        setAnalysisState(s => ({ ...s, view: 'volume', aggregation: 'week' }));
                        setShowViewsMenu(false);
                        trackClicks({ event: 'views.apply', view: 'Volume-Week' });
                      }}
                    >
                      Volume-Week
                    </button>
                    <button
                      className='w-full text-left px-3 py-2 hover:bg-white/10'
                      onClick={() => {
                        setAnalysisState(s => ({ ...s, view: 'trades', aggregation: 'month' }));
                        setShowViewsMenu(false);
                        trackClicks({ event: 'views.apply', view: 'Trades-Month' });
                      }}
                    >
                      Trades-Month
                    </button>
                    <button
                      className='w-full text-left px-3 py-2 hover:bg-white/10'
                      onClick={() => {
                        const views = JSON.parse(localStorage.getItem('savedViews') || '[]');
                        const next = [
                          ...views,
                          { name: `View ${views.length + 1}`, state: analysisState },
                        ];
                        localStorage.setItem('savedViews', JSON.stringify(next));
                        setShowViewsMenu(false);
                        trackClicks({ event: 'views.save', state: analysisState });
                      }}
                    >
                      + Save current
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* <Link
              to='/journal'
              className='xs:inline-flex px-3 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm transition-all duration-200 hover:scale-105 shadow-lg'
              onClick={() => setShowJournalPanel(true)}
            >
              New journal entry
            </Link> */}
       
            <ProfilePicture name={getUser?.firstName} />
          </div>
        </div>

        {/* Mobile menu backdrop */}
        {isMenuOpen && (
          <div
            className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden'
            onClick={closeMenu}
          />
        )}

        <nav
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } lg:flex lg:flex-row flex-col lg:items-center w-full lg:w-auto transition-all duration-300 bg-slate-900/95 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-0 border-t border-slate-700/50 lg:border-none shadow-xl lg:shadow-none relative z-40`}
        >
          <ul className='flex flex-col lg:flex-row gap-0 lg:gap-4 text-white text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-3 sm:py-4 lg:py-0 lg:px-0'>
            {main_menu.map(
              (item, index) => {
                const isEnabled = item.hasAccess && isNavItemEnabled(item.path);
                return (
                  <li key={index} className={`${isActive(item.path)} group`}>
                    {isEnabled ? (
                      <Link
                        onClick={() => handleLinkClick(item.data, item.hasAccess)}
                        to={item.path}
                        target={item.newTab ? '_blank' : ''}
                        rel={'noopener noreferrer'}
                        className='flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 lg:px-2 lg:py-1 rounded-lg lg:rounded-none hover:bg-white/10 lg:hover:bg-transparent transition-all duration-200 group-hover:text-cyan-400'
                      >
                        <item.icon className='h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 flex-shrink-0' />
                        <span className='font-medium text-sm sm:text-base'>{item.name}</span>
                      </Link>
                    ) : (
                      <div
                        className='flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 lg:px-2 lg:py-1 rounded-lg lg:rounded-none opacity-50 cursor-not-allowed'
                        title='Connect an account to access this feature'
                      >
                        <item.icon className='h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 flex-shrink-0' />
                        <span className='font-medium text-sm sm:text-base'>{item.name}</span>
                      </div>
                    )}
                  </li>
                );
              }
            )}

            {/* Mentor button */}
            <li className='mt-3 sm:mt-4 lg:mt-0 lg:hidden border-t border-slate-700/50 pt-3 sm:pt-4'>
              <div className='px-3 sm:px-4'>
                <JoinOurFreeTelegram className='w-full rounded-2xl' text='Join our free telegram' />
              </div>
            </li>
          </ul>
        </nav>
      </header>

      {/* Forex Calculator Modal */}
      <ForexCalculatorModal
        isOpen={showForexCalculator}
        onClose={() => setShowForexCalculator(false)}
      />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <QuickJournalPanel
        isOpen={showJournalPanel}
        onClose={() => setShowJournalPanel(false)}
        context={{ from: analysisState.timeframe, to: 'now', symbol: analysisState.symbol }}
      />
    </>
  );
}
