import type { ReactNode } from 'react';

type MetricsByDateLike = {
  balance?: string;
  equity?: string;
  riskReward?: string;
  equityLabel?: string;
};

type MetricsLike = {
  balance?: number;
  equity?: number;
  winRate?: number;
  averageWin?: number;
  wonTrades?: number;
  lostTrades?: number;
} | null;

export function MetricsDashChrome({
  metrics: _metrics,
  metricsByDate: _metricsByDate,
  tradesCount,
  isLoading,
  isRefreshing = false,
  headerSkeleton = false,
  rightActions,
  timeNavigation,
  children,
}: {
  metrics: MetricsLike;
  metricsByDate: MetricsByDateLike;
  tradesCount: number;
  isLoading: boolean;
  isRefreshing?: boolean;
  headerSkeleton?: boolean;
  rightActions?: ReactNode;
  timeNavigation?: ReactNode;
  children: ReactNode;
}) {
  const subDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const tradesLabel =
    isLoading && tradesCount === 0
      ? '— trades in view'
      : `${tradesCount} trade${tradesCount === 1 ? '' : 's'} in view`;

  return (
    <div className='tt-dash-body'>
      <div className='tt-dash'>
        <div className='tt-page-head'>
          <div className='min-w-0 flex-1'>
            <h1 className='tt-page-title'>Overview</h1>
            {headerSkeleton ? (
              <div className='mt-1 space-y-1.5' aria-hidden>
                <div className='tt-skeleton tt-skeleton-text h-3 w-56 max-w-full' />
              </div>
            ) : (
              <p className='tt-page-sub'>
                {subDate} · {tradesLabel}
                {isRefreshing ? (
                  <span className='text-[var(--tt-fg-3)]'> · Updating…</span>
                ) : (
                  <>
                    {' '}
                    · <span className='text-[var(--tt-profit)]'>Live</span>
                  </>
                )}
              </p>
            )}
          </div>
          {rightActions ? (
            <div className='flex shrink-0 flex-wrap items-center justify-end gap-3'>
              {rightActions}
            </div>
          ) : isLoading ? (
            <div
              className='tt-skeleton h-10 w-[140px] shrink-0 rounded-lg'
              aria-hidden
            />
          ) : null}
        </div>

        {timeNavigation ? <div className='tt-time-nav-slot'>{timeNavigation}</div> : null}

        {children}
      </div>
    </div>
  );
}
