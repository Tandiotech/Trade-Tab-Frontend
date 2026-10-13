import { lazy, Suspense } from 'react';
import TimeNavigation from '@/component/BtnDespokt/TimeNavigation';
import { MetricsDashChrome } from '@/pages/metrics/components/MetricsDashChrome';
import { KeyMetricsSection } from '@/pages/metrics/components/KeyMetricsSection';
import {
  MainChartSectionSkeleton,
  MetricsPageShellSkeleton,
} from '@/pages/metrics/components/MetricsSkeletons';
import { MetricsDemoBanner } from './MetricsDemoBanner';
import { useExampleMetricsDemo } from './useExampleMetricsDemo';

const MainChartSection = lazy(() =>
  import('@/pages/metrics/components/MainChartSection').then(m => ({
    default: m.MainChartSection,
  }))
);

export function MetricsPublicDemo() {
  const {
    loading,
    ready,
    metrics,
    trades,
    growth,
    metricsByDate,
    formattedDates,
    currentFilter,
    setCurrentFilter,
    currentAccount,
    dateStartFilter,
    dateEndFilter,
  } = useExampleMetricsDemo();

  if (loading || !ready) {
    return (
      <section className='tt-marketing-section tt-marketing-section--demo px-4 md:px-8' aria-busy='true' aria-label='Loading metrics demo'>
        <div className='mx-auto max-w-[1440px]'>
          <MetricsDemoBanner />
          <div className='tt-panel'>
            <MetricsPageShellSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='tt-marketing-section tt-marketing-section--demo px-4 md:px-8' aria-label='Metrics dashboard demo'>
      <div className='mx-auto max-w-[1440px]'>
        <MetricsDemoBanner />
        <div className='tt-dash tt-metrics-landing-demo'>
          <MetricsDashChrome
            metrics={metrics}
            metricsByDate={metricsByDate}
            tradesCount={trades.length}
            isLoading={false}
            isRefreshing={false}
            timeNavigation={
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
            }
          >
            <div className='tt-panel mb-3.5'>
              <div className='tt-metrics-fade-in'>
                <KeyMetricsSection
                  metricsByDate={metricsByDate}
                  currentAccount={currentAccount}
                  metrics={metrics}
                  dateStartFilter={dateStartFilter || ''}
                  dateEndFilter={dateEndFilter || ''}
                  proModeActivated={false}
                />
              </div>
            </div>

            <div className='tt-panel mb-3.5 min-h-0'>
              <Suspense fallback={<MainChartSectionSkeleton />}>
                <MainChartSection
                  metrics={metrics}
                  growth={growth}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  dateStartFilter={dateStartFilter}
                  dateEndFilter={dateEndFilter}
                  trades={trades}
                  currentAccount={currentAccount}
                  proModeActivated={false}
                />
              </Suspense>
            </div>
          </MetricsDashChrome>
        </div>
      </div>
    </section>
  );
}
