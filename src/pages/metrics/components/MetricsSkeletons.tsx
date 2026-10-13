import '@/pages/shared/TradeTabDesign.css';

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

function Sk({ className = '', style }: SkeletonProps) {
  return <div className={`tt-skeleton ${className}`} style={style} aria-hidden />;
}

export const TimeNavigationSkeleton = () => (
  <div className='tt-time-nav-sticky' aria-hidden>
    <div className='tt-time-nav-sticky__inner'>
      <div className='flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-center gap-2.5'>
          <Sk className='h-9 w-9 shrink-0 rounded-lg' />
          <div className='flex flex-col gap-1.5'>
            <Sk className='tt-skeleton-text h-2.5 w-12' />
            <Sk className='tt-skeleton-text h-4 w-40 max-w-[70vw]' />
          </div>
        </div>
        <div className='flex gap-1.5 overflow-hidden'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Sk key={i} className='h-8 w-10 shrink-0 rounded-full' />
          ))}
          <Sk className='h-8 w-14 shrink-0 rounded-full' />
        </div>
      </div>
    </div>
  </div>
);

export const HeaderMetricsSkeleton = () => (
  <div className='space-y-2' aria-hidden>
    <Sk className='tt-skeleton-title' />
    <Sk className='tt-skeleton-text h-3 w-48 max-w-full' />
  </div>
);

export const KeyMetricsSectionSkeleton = () => (
  <div className='w-full' aria-hidden>
    <Sk className='tt-skeleton-kpi-row rounded-[14px]' />
  </div>
);

export const MainChartSectionSkeleton = () => (
  <div className='tt-metrics-chart-row grid grid-cols-12 gap-4' aria-hidden>
    <div className='col-span-12 md:col-span-3'>
      <div className='tt-card flex flex-col gap-3 p-4'>
        <Sk className='tt-skeleton-text h-4 w-2/3' />
        {Array.from({ length: 5 }).map((_, i) => (
          <Sk key={i} className='tt-skeleton-text h-3 w-full' />
        ))}
      </div>
    </div>
    <div className='col-span-12 md:col-span-9'>
      <div className='tt-card flex h-full min-h-[280px] flex-col p-4'>
        <div className='mb-3 flex justify-between gap-2'>
          <Sk className='tt-skeleton-text h-4 w-24' />
          <div className='flex gap-2'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Sk key={i} className='h-8 w-14 rounded-lg' />
            ))}
          </div>
        </div>
        <Sk className='tt-skeleton-chart min-h-[200px] flex-1' />
      </div>
    </div>
  </div>
);

export const PerformanceOverviewSectionSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 lg:grid-cols-2' aria-hidden>
    {Array.from({ length: 2 }).map((_, i) => (
      <div key={i} className='tt-card p-4'>
        <Sk className='tt-skeleton-text mb-3 h-4 w-1/3' />
        <Sk className='h-[220px] w-full rounded-xl' />
      </div>
    ))}
  </div>
);

export const WinLossAnalysisSectionSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-3' aria-hidden>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className='tt-card flex min-h-[200px] flex-col items-center justify-center p-4'>
        <Sk className='tt-skeleton-text mb-3 h-4 w-1/2' />
        <Sk className='h-32 w-32 rounded-full' />
      </div>
    ))}
  </div>
);

export const AdvancedAnalyticsSectionSkeleton = () => (
  <div className='grid grid-cols-2 gap-3 md:grid-cols-4' aria-hidden>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className='tt-card p-3'>
        <Sk className='tt-skeleton-text mb-2 h-3 w-2/3' />
        <Sk className='tt-skeleton-text h-6 w-1/2' />
      </div>
    ))}
  </div>
);

export const RecentActivitySectionSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-2' aria-hidden>
    <div className='tt-card p-4'>
      <Sk className='tt-skeleton-text mb-3 h-5 w-1/3' />
      <Sk className='h-48 w-full rounded-xl' />
    </div>
    <div className='tt-card space-y-3 p-4'>
      <Sk className='tt-skeleton-text h-5 w-1/2' />
      <div className='grid grid-cols-2 gap-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Sk key={i} className='h-16 rounded-xl' />
        ))}
      </div>
    </div>
  </div>
);

/** Full page shell for route fallback — matches MetricsDashChrome layout */
export const MetricsPageShellSkeleton = () => (
  <main className='tt-theme tt-dash-body min-h-screen w-full'>
    <div className='tt-dash'>
      <div className='tt-page-head mb-2'>
        <HeaderMetricsSkeleton />
      </div>
      <div className='tt-time-nav-slot'>
        <TimeNavigationSkeleton />
      </div>
      <div className='tt-panel mb-3.5'>
        <KeyMetricsSectionSkeleton />
      </div>
      <div className='tt-panel mb-3.5 min-h-0'>
        <MainChartSectionSkeleton />
      </div>
      <div className='tt-panel mb-3.5'>
        <PerformanceOverviewSectionSkeleton />
      </div>
      <div className='tt-panel mb-3.5'>
        <WinLossAnalysisSectionSkeleton />
      </div>
      <div className='tt-panel mb-3.5'>
        <AdvancedAnalyticsSectionSkeleton />
      </div>
      <div className='tt-panel'>
        <RecentActivitySectionSkeleton />
      </div>
    </div>
  </main>
);

/** @deprecated Use MetricsPageShellSkeleton */
export const MetricsPageSkeleton = MetricsPageShellSkeleton;
