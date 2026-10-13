import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Loader1 from '../../component/loader/Loader1';
import { MetricData } from '../../types/metrics';
import EditPublicLinkPanel from './editPanel/EditPublicLinkPanel';
import useAuthUser from '../../hook/useAuthUser';
import { http } from '../../utils/http_request';
import ChartsAndStatsPublicLink from './ChartsAndStatsPublicLink';
import { RUTE_GET_PUBLIC_LINK } from '@/utils/Rutes';
import Navbar from '../../component/header/Navbar';
import AsideUserBar from './components/AsideUserBar';
import DynamicLayout from './components/DynamicLayout';
import CompactHeader from './components/CompactHeader';
import '../shared/TradeTabDesign.css';

export default function PublicLink({ b = '' }: any) {
  const { isLoggedIn } = useAuthUser();
  const { username, account } = useParams();

  const [trades, setTrades] = useState<any[]>([]);
  const [dataMetrics, setDataMetrics] = useState<any>({} as MetricData);
  const [user, setUser] = useState<any>({});
  const [publicAccount, setPublicAccount] = useState<any>({});
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1280
  );

  const currentUser = (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : {};
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return {};
    }
  })();
  const handleLogoClick = () => {
    setShowNavbar(v => !v);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await http.post(RUTE_GET_PUBLIC_LINK + b, {
        username,
        publicIdentifier: account,
      });

      const { metrics, trades, user, publicAccount } = res.data.data;

      setDataMetrics(metrics);
      setTrades(trades);
      setUser(user);
      setPublicAccount(publicAccount);
    } catch (e) {
      console.error('Error in public route: ', e);
    } finally {
      setLoading(false);
    }
  }, [username, account, b]);

  useEffect(() => {
    fetchData();
  }, [fetchData, publicAccount?.dataMode, editMode]);

  if (loading) {
    return (
      <div className='tt-theme grid h-screen place-items-center bg-[var(--tt-bg-0)] text-[var(--tt-fg-1)]'>
        <Loader1 />
      </div>
    );
  }

  const isOwner = currentUser?.userName == username;

  return (
    <div className='tt-theme relative min-h-screen bg-[var(--tt-bg-0)] text-[var(--tt-fg-1)]'>
      {showNavbar && <Navbar displayPaddingTop={false} accountsLoading={false} unreadCount={0} />}

      {isLoggedIn() && editMode && (
        <EditPublicLinkPanel
          publicAccount={publicAccount}
          user={user}
          setUser={setUser}
          setEditMode={setEditMode}
          fetchData={fetchData}
          account={account}
          currentUser={currentUser}
        />
      )}

      <DynamicLayout
        isExpanded={isSidebarExpanded}
        onToggle={setIsSidebarExpanded}
        expandedLeadingActions={
          isLoggedIn() ? (
            <button
              type='button'
              onClick={handleLogoClick}
              className={`rounded-lg border p-2 transition-colors duration-200 ${
                showNavbar
                  ? 'border-[var(--tt-brand)] bg-[oklch(0.72_0.14_195_/0.12)]'
                  : 'border-[var(--tt-line-2)] bg-[var(--tt-bg-1)] hover:border-[var(--tt-line-3)] hover:bg-[oklch(1_0_0_/0.04)]'
              }`}
              title={showNavbar ? 'Hide navigation' : 'Show navigation'}
            >
              <img src='/logo.png' alt='' className='h-5 w-5 object-contain' />
            </button>
          ) : undefined
        }
        compactHeader={
          <CompactHeader
            user={user}
            shareUrl={`${window.location.host}/${username}/${account}`}
            onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
            isSidebarExpanded={isSidebarExpanded}
            onToggleNavbar={isLoggedIn() ? handleLogoClick : undefined}
            showNavbar={showNavbar}
          />
        }
        asideContent={
          <div className='space-y-3'>
            {isOwner && (
              <div className='flex flex-col gap-2 rounded-[var(--tt-radius-lg)] border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-3'>
                <div className='flex flex-wrap justify-center gap-2'>
                  <button
                    type='button'
                    onClick={() => setEditMode(!editMode)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      editMode
                        ? 'bg-[oklch(0.55_0.2_25)] text-white hover:bg-[oklch(0.5_0.2_25)]'
                        : 'border border-[var(--tt-line-2)] bg-[var(--tt-bg-0)] text-[var(--tt-fg-0)] hover:border-[var(--tt-brand)] hover:bg-[oklch(1_0_0_/0.04)]'
                    }`}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                  {editMode && (
                    <button
                      type='button'
                      onClick={() => {
                        /* persist handled inside edit panel */
                      }}
                      className='rounded-lg border border-[var(--tt-line-2)] bg-[var(--tt-bg-0)] px-3 py-2 text-xs font-medium text-[var(--tt-profit)] hover:border-[var(--tt-profit)]'
                    >
                      Save
                    </button>
                  )}
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tt-profit)]' aria-hidden />
                  <span className='text-xs text-[var(--tt-fg-3)]'>Admin mode</span>
                </div>
              </div>
            )}

            <AsideUserBar
              username={username ?? ''}
              account={account ?? ''}
              dataMetrics={dataMetrics}
              user={user ?? {}}
              publicAccount={publicAccount}
              trades={trades}
            />
          </div>
        }
        mainContent={
          <main className='h-full min-w-0 max-w-full px-3 py-4 sm:px-4 md:px-5'>
            <ChartsAndStatsPublicLink
              dataMetrics={dataMetrics}
              data_mode={user?.profile?.dataMode}
              trades={trades}
            />
          </main>
        }
        defaultExpanded={true}
      />
    </div>
  );
}
