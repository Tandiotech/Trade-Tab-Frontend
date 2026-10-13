import { useMemo, useState, useContext, useEffect, lazy, Suspense } from 'react';
import OptionsButtons from '../../component/BtnDespokt/OptionsButtons';
import { useFormattedDates } from '../../hook/useFormattedDates';
import { TradesContext } from '../../context/accounts/TradesProvider';
import { useMetricsFilterByDates } from './hooks/useMetricsFilterByDates';
import { FooterAffiliate } from '../affiliate/sections/footer.tsx';
import { useMTAccounts } from '../../context/accounts/MTAccountsContext.tsx';
import { useMetrics } from '../../context/accounts/MetricsProvider.tsx';
import WelcomeSplashScreen from '../auth/signin/WelcomeSplashScreen.tsx';
import ErrorBoundary from '../../component/ErrorBoundary';
import { SafeSection } from '@/lib/utils.tsx';
import { IFormattedDates, IGrowth, IMetrics, MetricsByDate } from './interface.ts';
import TimeNavigation from '../../component/BtnDespokt/TimeNavigation.tsx';
import RequestAccountSyncButton from '@/component/BtnDespokt/RequestAccountSyncButton.tsx';
import { useOnboarding } from '@/context/OnboardingContext';
import { useConnectionJobs } from '@/context/ConnectionJobContext';
import { useMode } from '@/context/ModeContext';
import { MetricsDashChrome } from './components/MetricsDashChrome.tsx';
import { MetricsDeferredSection } from './components/MetricsDeferredSection.tsx';
import { useMetricsPageState } from './hooks/useMetricsPageState.ts';
import { KeyMetricsSection } from './components/KeyMetricsSection.tsx';
import {
  KeyMetricsSectionSkeleton,
  MainChartSectionSkeleton,
  PerformanceOverviewSectionSkeleton,
  WinLossAnalysisSectionSkeleton,
  AdvancedAnalyticsSectionSkeleton,
  RecentActivitySectionSkeleton,
  TimeNavigationSkeleton,
  MetricsPageShellSkeleton,
} from './components/MetricsSkeletons.tsx';
import '../shared/TradeTabDesign.css';

const MainChartSection = lazy(() =>
  import('./components/MainChartSection.tsx').then(m => ({ default: m.MainChartSection }))
);
const PerformanceOverviewSection = lazy(() =>
  import('./components/PerformanceOverviewSection.tsx').then(m => ({
    default: m.PerformanceOverviewSection,
  }))
);
const WinLossAnalysisSection = lazy(() =>
  import('./components/WinLossAnalysisSection.tsx').then(m => ({
    default: m.WinLossAnalysisSection,
  }))
);
const AdvancedAnalyticsSection = lazy(() =>
  import('./components/AdvancedAnalyticsSection.tsx').then(m => ({
    default: m.AdvancedAnalyticsSection,
  }))
);
const RecentActivitySection = lazy(() =>
  import('./components/RecentActivitySection.tsx').then(m => ({
    default: m.RecentActivitySection,
  }))
);

function Metrics() {
  const [currentFilter, setCurrentFilter] = useState('Balance');
  const [proModeActivated] = useState(false);

  const { currentAccount, accounts = [], loadingAccounts, showWelcome } = useMTAccounts() || {};

  let formattedDates: IFormattedDates;
  let dateStartFilter: string | null;
  let dateEndFilter: string | null;

  try {
    formattedDates = useFormattedDates({
      initialValues: { startDate: null, endDate: null },
    });
    dateStartFilter = formattedDates?.dateStartFilter || null;
    dateEndFilter = formattedDates?.dateEndFilter || null;
  } catch (error) {
    console.error('Error with formatted dates:', error);
    const noop = () => {};
    formattedDates = {
      dateStartFilter: null,
      dateEndFilter: null,
      dateStartFilterFormatted: '',
      dateEndFilterFormatted: '',
      setDateStartFilter: noop,
      setDateEndFilter: noop,
    };
    dateStartFilter = null;
    dateEndFilter = null;
  }

  const {
    metricsData,
    loadingMetrics,
    isRefreshing = false,
    hasCachedMetrics = false,
  } = useMetrics() || {};

  const tradesContextData = useContext(TradesContext) || {};
  const { tradesCache = {}, tradesLoading: providerTradesLoading = false } = tradesContextData;

  const rawTrades = currentAccount?.external_id
    ? tradesCache[currentAccount.external_id] || []
    : [];
  const rawTradesLoading = providerTradesLoading;

  const { isOnboardingActive } = useOnboarding();
  const { isExampleMode } = useMode();
  const { jobs } = useConnectionJobs();

  const isBackgroundJobActive = currentAccount?._id
    ? Array.from(jobs.values()).some(
        job =>
          job.accountId === currentAccount._id &&
          (job.status === 'ACTIVE' || job.status === 'STALLED' || job.status === 'PENDING')
      )
    : false;

  const [dummyMetricsData, setDummyMetricsData] = useState<any>(null);
  const [loadingDummyData, setLoadingDummyData] = useState(false);

  useEffect(() => {
    const shouldLoadDummy =
      isExampleMode || (!isOnboardingActive && (!Array.isArray(accounts) || accounts.length === 0));

    if (shouldLoadDummy && !dummyMetricsData && !loadingDummyData) {
      setLoadingDummyData(true);
      import('../../assets/data/exampleAccount.ts')
        .then(module => {
          setDummyMetricsData(module.default);
          setLoadingDummyData(false);
        })
        .catch(error => {
          console.error('Error loading dummy data:', error);
          setLoadingDummyData(false);
        });
    }
  }, [isExampleMode, isOnboardingActive, accounts?.length, dummyMetricsData, loadingDummyData]);

  const { trades, tradesLoading } = useMemo(() => {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      if (isOnboardingActive) {
        return { trades: [], tradesLoading: false };
      }
      if (isExampleMode) {
        return {
          trades: dummyMetricsData?.tradesArray || [],
          tradesLoading: loadingDummyData,
        };
      }
      return { trades: [], tradesLoading: false };
    }

    if (rawTradesLoading) {
      return { trades: [], tradesLoading: true };
    }

    if (currentAccount && currentAccount._id && currentAccount._id !== 'undefined') {
      const hasRealTrades = Array.isArray(rawTrades) && rawTrades.length > 0;
      return {
        trades: hasRealTrades ? rawTrades : dummyMetricsData?.tradesArray || [],
        tradesLoading: false,
      };
    }

    return {
      trades: dummyMetricsData?.tradesArray || [],
      tradesLoading: loadingDummyData,
    };
  }, [
    accounts?.length,
    currentAccount?._id,
    rawTradesLoading,
    rawTrades,
    isOnboardingActive,
    isExampleMode,
    dummyMetricsData?.tradesArray?.length,
    loadingDummyData,
  ]);

  const metrics: IMetrics = useMemo(() => {
    const empty: IMetrics = {
      balance: 0,
      equity: 0,
      profit: 0,
      trades: [],
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      recoveryFactor: 0,
      expectancy: 0,
      growth: [],
    } as IMetrics;

    if (!Array.isArray(accounts) || accounts.length === 0) {
      if (isOnboardingActive) return empty;
      if (isExampleMode) return dummyMetricsData || empty;
      return empty;
    }
    if (currentAccount?._id && currentAccount._id !== 'undefined') {
      return metricsData || dummyMetricsData || empty;
    }
    return dummyMetricsData || empty;
  }, [
    accounts?.length,
    currentAccount?._id,
    metricsData,
    isOnboardingActive,
    isExampleMode,
    dummyMetricsData,
  ]);

  const safeMetrics: IMetrics = useMemo(
    () => ({
      ...metrics,
      growth: Array.isArray(metrics?.growth) ? metrics.growth : [],
    }),
    [metrics]
  );

  const metricsByDate: MetricsByDate = useMetricsFilterByDates({
    metrics: safeMetrics,
    formattedDates,
  });

  const growth: IGrowth = Array.isArray(metricsByDate?.growth) ? metricsByDate.growth : [];

  const hasAccounts = Array.isArray(accounts) && accounts.length > 0;
  const hasMetricsPayload = !!(safeMetrics && (metricsData || dummyMetricsData || hasCachedMetrics));

  const pageState = useMetricsPageState({
    loadingAccounts,
    loadingMetrics,
    tradesLoading,
    isRefreshing,
    hasAccounts,
    hasMetricsPayload,
    hasCachedMetrics,
    growth,
  });

  if (pageState.phase === 'boot' && !hasAccounts) {
    return (
      <ErrorBoundary>
        <SafeSection sectionName='MetricsMain'>
          <MetricsPageShellSkeleton />
        </SafeSection>
      </ErrorBoundary>
    );
  }

  if (
    !isOnboardingActive &&
    hasAccounts &&
    !loadingAccounts &&
    !tradesLoading &&
    trades.length < 1 &&
    !isBackgroundJobActive
  ) {
    return (
      <div className='tt-theme px-1 lg:px-2'>
        <div className='mb-6 mt-5 w-full rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] px-4 py-3 text-center'>
          <p className='font-medium text-[var(--tt-fg-2)]'>
            Unable to synchronize trades for this account. Try clicking
            <span className='font-semibold text-[var(--tt-brand)]'> Resync </span>
            or wait a few minutes if the account was recently added (deployment may take up to 5
            minutes).
          </p>
        </div>
        {currentAccount?._id && (
          <RequestAccountSyncButton accountId={currentAccount._id} />
        )}
      </div>
    );
  }

  if (isOnboardingActive && !hasAccounts) {
    return null;
  }

  if (!isExampleMode && !hasAccounts) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeSection sectionName='MetricsMain'>
        <main className='relative min-h-screen w-full tt-theme tt-page-enter'>
          <MetricsDashChrome
            metrics={metrics}
            metricsByDate={metricsByDate}
            tradesCount={trades.length}
            isLoading={pageState.loading.any}
            isRefreshing={isRefreshing}
            headerSkeleton={pageState.loading.accounts || pageState.showKeyMetricsSkeleton}
            rightActions={
              pageState.canShow.keyMetrics ? (
                <SafeSection sectionName='OptionsButtons'>
                  <OptionsButtons
                    ACCOUNT_ID={currentAccount?._id || currentAccount?.external_id || ''}
                  />
                </SafeSection>
              ) : undefined
            }
            timeNavigation={
              pageState.loading.accounts ? (
                <TimeNavigationSkeleton />
              ) : (
                <SafeSection sectionName='MenuMetrics'>
                  <TimeNavigation
                      dateStart={formattedDates.dateStartFilter}
                      dateEnd={formattedDates.dateEndFilter}
                      onRangeChange={(start, end) => {
                        formattedDates.setDateStartFilter(start);
                        formattedDates.setDateEndFilter(end);
                      }}
                      metrics={metrics}
                      currentAccount={currentAccount}
                      isEmptyForRange={metricsByDate.isEmptyForRange}
                    />
                </SafeSection>
              )
            }
          >
            {showWelcome && (
              <SafeSection sectionName='WelcomeSplashScreen'>
                <WelcomeSplashScreen variant='full' />
              </SafeSection>
            )}

            <div className='tt-panel mb-3.5'>
              {pageState.showKeyMetricsSkeleton ? (
                <KeyMetricsSectionSkeleton />
              ) : (
                <div className='tt-metrics-fade-in'>
                  <SafeSection sectionName='KeyMetricsSection'>
                    <KeyMetricsSection
                      metricsByDate={metricsByDate}
                      currentAccount={currentAccount}
                      metrics={metrics}
                      dateStartFilter={dateStartFilter || ''}
                      dateEndFilter={dateEndFilter || ''}
                      proModeActivated={proModeActivated}
                    />
                  </SafeSection>
                </div>
              )}
            </div>

            <div className='tt-panel mb-3.5 min-h-0'>
              {pageState.showChartSkeleton ? (
                <MainChartSectionSkeleton />
              ) : pageState.canShow.chart ? (
                <div className='tt-metrics-fade-in'>
                  <Suspense fallback={<MainChartSectionSkeleton />}>
                    <SafeSection sectionName='MainChartSection'>
                      <MainChartSection
                        metrics={metrics}
                        growth={growth}
                        currentFilter={currentFilter}
                        setCurrentFilter={setCurrentFilter}
                        dateStartFilter={dateStartFilter}
                        dateEndFilter={dateEndFilter}
                        trades={trades}
                        currentAccount={currentAccount}
                        proModeActivated={proModeActivated}
                      />
                    </SafeSection>
                  </Suspense>
                </div>
              ) : (
                <MainChartSectionSkeleton />
              )}
            </div>

            <MetricsDeferredSection fallback={<PerformanceOverviewSectionSkeleton />}>
              <div className='tt-panel mb-3.5 min-h-0'>
                {pageState.canShow.performance ? (
                  <div className='tt-metrics-fade-in'>
                    <SafeSection sectionName='PerformanceOverviewSection'>
                      <PerformanceOverviewSection metrics={metrics} trades={trades} />
                    </SafeSection>
                  </div>
                ) : (
                  <PerformanceOverviewSectionSkeleton />
                )}
              </div>
            </MetricsDeferredSection>

            <MetricsDeferredSection fallback={<WinLossAnalysisSectionSkeleton />}>
              <div className='tt-panel mb-3.5'>
                {pageState.canShow.winLoss ? (
                  <div className='tt-metrics-fade-in'>
                    <SafeSection sectionName='WinLossAnalysisSection'>
                      <WinLossAnalysisSection metrics={metrics} />
                    </SafeSection>
                  </div>
                ) : (
                  <WinLossAnalysisSectionSkeleton />
                )}
              </div>
            </MetricsDeferredSection>

            <MetricsDeferredSection fallback={<AdvancedAnalyticsSectionSkeleton />}>
              <div className='tt-panel mb-3.5'>
                {pageState.canShow.advanced ? (
                  <div className='tt-metrics-fade-in'>
                    <SafeSection sectionName='AdvancedAnalyticsSection'>
                      <AdvancedAnalyticsSection metrics={metrics} />
                    </SafeSection>
                  </div>
                ) : (
                  <AdvancedAnalyticsSectionSkeleton />
                )}
              </div>
            </MetricsDeferredSection>

            <MetricsDeferredSection fallback={<RecentActivitySectionSkeleton />}>
              <div className='tt-panel mb-3.5'>
                {pageState.canShow.recent ? (
                  <div className='tt-metrics-fade-in'>
                    <SafeSection sectionName='RecentActivitySection'>
                      <RecentActivitySection
                        trades={trades}
                        accounts={accounts}
                        metrics={metrics}
                        currentAccount={currentAccount}
                      />
                    </SafeSection>
                  </div>
                ) : (
                  <RecentActivitySectionSkeleton />
                )}
              </div>
            </MetricsDeferredSection>

            <SafeSection sectionName='FooterAffiliate'>
              <FooterAffiliate />
            </SafeSection>
          </MetricsDashChrome>
        </main>
      </SafeSection>
    </ErrorBoundary>
  );
}

export default Metrics;
