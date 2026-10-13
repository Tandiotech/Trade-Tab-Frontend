import { useState, useMemo, useContext } from 'react';
import EvaluationBox from './emotionalEvaluation/Evaluationbox';
import { TradesContext } from '../../context/accounts/TradesProvider';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext';
import Toggle from '../../component/Toggle';
import { useJournalContext } from '../../context/JournalProvider';
import RequestAccountSyncButton from '@/component/BtnDespokt/RequestAccountSyncButton';
import { useOnboarding } from '@/context/OnboardingContext';
import { useMode } from '@/context/ModeContext';
import { useNotifications } from '@/context/NotificationContext';
import { useConnectionJobs } from '@/context/ConnectionJobContext';
import { calculateJournalData } from './calculateJournalData';
import { FooterAffiliate } from '../affiliate/sections/footer';
import { FaExpandAlt } from 'react-icons/fa';
import { BiCollapse } from 'react-icons/bi';
import JournalCalendar from './journaling/JournalCalendar';
import economicCalendar2025 from '@/pages/journal/journaling/utils/economicCalendar2025';
import TopStatsBar from './components/TopStatsBar';
import { ITrade } from '../metrics/interface';
import dummyMetricsData from '@/assets/data/exampleAccount';
import '../shared/TradeTabDesign.css';

interface Account {
  id?: string;
  balance?: number;
  currency?: string;
}

export default function Journal() {
  const [expandedCalendar, setExpandedCalendar] = useState<boolean>(false);
  const [isEconomicCalendarActive] = useState<boolean>(true);

  const {
    relativeValues,
    setrelativeValues,
    stlPlan,
    expandedJournalEntries,
  } = useJournalContext();

  const { currentAccount, accounts = [] }: { currentAccount?: Account; accounts?: any[] } =
    useMTAccounts();
  const { isOnboardingActive } = useOnboarding();
  const { isExampleMode } = useMode();
  const { getActiveNotifications } = useNotifications();
  const { jobs } = useConnectionJobs();
  const isBackgroundJobActive = currentAccount?._id
    ? Array.from(jobs.values()).some(
        job =>
          job.accountId === currentAccount._id &&
          (job.status === 'ACTIVE' || job.status === 'STALLED' || job.status === 'PENDING')
      )
    : false;

  const tradesContextData = useContext(TradesContext) || {};
  const { tradesCache = {}, tradesLoading = false } = tradesContextData;

  let trades: ITrade[] = currentAccount?.external_id
    ? tradesCache[currentAccount.external_id] || []
    : [];
  const tradesLoading_var = tradesLoading;

  const activeConnections = getActiveNotifications();
  const isAccountConnecting =
    currentAccount &&
    activeConnections.some(
      n =>
        n.accountNumber === currentAccount.account_number?.toString() ||
        n.accountName === currentAccount.account_name
    );

  if (isAccountConnecting) {
    trades = [];
  } else if (currentAccount == null && !isOnboardingActive && isExampleMode) {
    trades = dummyMetricsData.tradesArray;
  }

  const journalData = useMemo(() => {
    const usingDummyTrades = trades.length === 0;
    const effectiveTrades = usingDummyTrades ? [] : trades;
    return calculateJournalData(effectiveTrades);
  }, [trades]);

  const shouldShowSyncMessage =
    !isOnboardingActive &&
    accounts?.length > 0 &&
    !tradesLoading_var &&
    trades.length < 1 &&
    currentAccount?._id &&
    !isBackgroundJobActive;

  if (isOnboardingActive && (!Array.isArray(accounts) || accounts.length === 0)) {
    return null;
  }

  if (!isExampleMode && (!Array.isArray(accounts) || accounts.length === 0)) {
    return null;
  }

  return (
    <div className='tt-theme tt-page-enter mx-auto w-full max-w-[1600px] px-1 lg:px-2'>
      {shouldShowSyncMessage && (
        <div className='mb-6 mt-5 w-full rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] px-4 py-3 text-center'>
          <p className='font-medium text-[var(--tt-fg-2)]'>
            Unable to synchronize trades for this account. Try clicking
            <span className='font-semibold text-[var(--tt-brand)]'> Resync </span>
            or wait a few minutes if the account was recently added (deployment may take up to 5
            minutes).
          </p>
        </div>
      )}

      <header className='mb-2 mt-2 px-1 md:px-0'>
        <h1 className='text-xl font-semibold text-[var(--tt-fg-0)] md:text-2xl'>Journal</h1>
        <p className='text-sm text-[var(--tt-fg-3)]'>Calendar, psychology, and trading goals</p>
      </header>

      <div className='flex w-full max-w-full flex-wrap items-center justify-between gap-3 px-1 md:px-0'>
        <div className='flex shrink-0 items-end justify-end'>
          {currentAccount?._id && <RequestAccountSyncButton accountId={currentAccount._id} />}
        </div>

        {currentAccount != null && (
          <div className='flex items-center justify-end gap-3 md:gap-14'>
            <Toggle
              initialValue={relativeValues}
              onToggle={() => setrelativeValues(!relativeValues)}
              label={['Percentage', 'Money']}
            />
          </div>
        )}
      </div>

      <div className='mt-4 w-full px-1 md:px-0'>
        {!expandedJournalEntries && (
          <div className='mb-1 mt-4 flex justify-end'>
            <button
              type='button'
              className='hidden text-3xl text-[var(--tt-brand)] transition-colors hover:text-[var(--tt-brand-2)] md:block'
              onClick={() => setExpandedCalendar(!expandedCalendar)}
              aria-expanded={expandedCalendar}
              aria-label={expandedCalendar ? 'Collapse calendar' : 'Expand calendar'}
            >
              {expandedCalendar ? <BiCollapse /> : <FaExpandAlt />}
            </button>
          </div>
        )}

        <div
          className={`grid gap-4 ${
            expandedJournalEntries
              ? 'grid-cols-1 md:grid-cols-4'
              : expandedCalendar
                ? 'grid-cols-1'
                : 'grid-cols-2 md:grid-cols-6'
          }`}
        >
          <div
            className={`relative ${
              expandedJournalEntries
                ? 'col-span-1 md:col-span-2'
                : expandedCalendar
                  ? 'col-span-2 md:col-span-6'
                  : 'col-span-2 md:col-span-4'
            }`}
          >
            <TopStatsBar />

            <JournalCalendar
              journalData={journalData}
              balance={currentAccount?.balance}
              stlPlan={stlPlan}
              withdrawalPlanMode={false}
              currentAccount={currentAccount}
              economicCalendarData={isEconomicCalendarActive ? economicCalendar2025 : []}
            />
          </div>

          <div
            className={`${
              expandedJournalEntries
                ? 'col-span-1 md:col-span-2'
                : expandedCalendar
                  ? 'col-span-1 mt-4 md:col-span-6 md:col-start-1'
                  : 'col-span-2 md:col-span-2'
            }`}
          >
            <EvaluationBox trades={trades} expandedCalendar={expandedCalendar} />
          </div>
        </div>
      </div>

      <div className='mt-8 rounded-t-lg'>
        <FooterAffiliate />
      </div>
    </div>
  );
}
