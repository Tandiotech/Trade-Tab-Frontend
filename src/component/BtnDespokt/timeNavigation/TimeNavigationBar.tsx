import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import { formatPeriodLabel } from '@/pages/metrics/utils/metricsDateRange';
import RequestAccountSyncButton from '../RequestAccountSyncButton';
import { PeriodPresets } from './PeriodPresets';
import { PeriodMorePopover } from './PeriodMorePopover';
import { getPeriodBoundsFromGrowth } from './periodPresetUtils';

export interface TimeNavigationProps {
  dateStart: string | null;
  dateEnd: string | null;
  onRangeChange: (start: string, end: string) => void;
  metrics?: { dailyGrowth?: { date: string }[] };
  currentAccount?: { _id?: string; updatedAt?: string | number | Date } | null;
  isEmptyForRange?: boolean;
}

function measureAppHeaderOffset(): number {
  const selectors = ['.layout-wrapper > header', 'nav.fixed.top-0', 'header.fixed'];
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) return el.getBoundingClientRect().height;
  }
  return 108;
}

function measureDashDock() {
  const dash = document.querySelector<HTMLElement>('.tt-dash');
  if (!dash) {
    return { left: 16, width: Math.min(window.innerWidth - 32, 1440) };
  }
  const rect = dash.getBoundingClientRect();
  return { left: rect.left, width: rect.width };
}

type BarContentProps = {
  periodLabel: string;
  isEmptyForRange: boolean;
  showSyncFooter: boolean;
  currentAccount?: TimeNavigationProps['currentAccount'];
  dateStart: string | null;
  dateEnd: string | null;
  anchor: Date;
  dataStart: Date;
  dataEnd: Date;
  onRangeChange: (start: string, end: string) => void;
  availableYears: number[];
  availableMonthsByYear: Map<number, Set<number>>;
};

function TimeNavBarContent({
  periodLabel,
  isEmptyForRange,
  showSyncFooter,
  currentAccount,
  dateStart,
  dateEnd,
  anchor,
  dataStart,
  dataEnd,
  onRangeChange,
  availableYears,
  availableMonthsByYear,
}: BarContentProps) {
  const presetProps = {
    dateStart,
    dateEnd,
    anchor,
    dataStart,
    dataEnd,
    onRange: onRangeChange,
  };

  const syncBtn =
    currentAccount?._id ? (
      <div className='tt-time-nav-sync shrink-0'>
        <RequestAccountSyncButton accountId={currentAccount._id} />
      </div>
    ) : null;

  return (
    <div className='tt-time-nav-sticky__inner'>
      <div className='tt-time-nav-mobile md:hidden'>
        <div className='tt-time-nav-mobile__row'>
          <p className='tt-time-nav-mobile__label' title={periodLabel}>
            {periodLabel}
          </p>
          {syncBtn}
        </div>
        {isEmptyForRange ? (
          <p className='text-[10px] font-medium leading-tight text-[var(--tt-loss)]'>
            No data in this period
          </p>
        ) : null}
        <div className='tt-time-nav-mobile__controls'>
          <PeriodPresets {...presetProps} compact />
          <PeriodMorePopover
            dateStart={dateStart}
            dateEnd={dateEnd}
            availableYears={availableYears}
            availableMonthsByYear={availableMonthsByYear}
            onRange={onRangeChange}
            compact
          />
        </div>
      </div>

      <div className='tt-time-nav-desktop hidden md:block'>
        <div className='flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3'>
          <div className='flex min-w-0 flex-1 items-center gap-2.5'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.04)]'>
              <Calendar className='h-4 w-4 text-[var(--tt-brand)]' aria-hidden />
            </div>
            <div className='min-w-0'>
              <p className='tt-kicker text-[10px] tracking-[0.12em] sm:text-[11px]'>Period</p>
              <p className='truncate text-sm font-semibold text-[var(--tt-fg-0)] sm:text-base'>
                {periodLabel}
              </p>
              {isEmptyForRange ? (
                <p className='text-[11px] font-medium text-[var(--tt-loss)]'>No data in this period</p>
              ) : null}
            </div>
          </div>

          <div className='flex min-w-0 flex-wrap items-center gap-2 lg:justify-end'>
            <PeriodPresets {...presetProps} />
            <PeriodMorePopover
              dateStart={dateStart}
              dateEnd={dateEnd}
              availableYears={availableYears}
              availableMonthsByYear={availableMonthsByYear}
              onRange={onRangeChange}
            />
            {syncBtn}
          </div>
        </div>

        {showSyncFooter && currentAccount?.updatedAt ? (
          <div className='mt-2 flex items-center gap-1.5 border-t border-[var(--tt-line-1)] pt-2 text-[11px] text-[var(--tt-fg-3)]'>
            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tt-profit)]' aria-hidden />
            Last synced{' '}
            <span className='font-semibold text-[var(--tt-fg-1)]'>
              {new Date(currentAccount.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function TimeNavigationBar({
  dateStart,
  dateEnd,
  onRangeChange,
  metrics,
  currentAccount,
  isEmptyForRange = false,
}: TimeNavigationProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inFlowRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [headerOffset, setHeaderOffset] = useState(108);
  const [dock, setDock] = useState({ left: 0, width: 0 });

  const { minDate, maxDate, availableYears, availableMonthsByYear } = useMemo(
    () => getPeriodBoundsFromGrowth(metrics?.dailyGrowth),
    [metrics?.dailyGrowth]
  );

  const anchor = maxDate ?? new Date();
  const dataStart = minDate ?? anchor;
  const dataEnd = maxDate ?? anchor;
  const periodLabel = formatPeriodLabel(dateStart, dateEnd);

  const syncLayout = useCallback(() => {
    const px = measureAppHeaderOffset();
    setHeaderOffset(px);
    document.documentElement.style.setProperty('--tt-nav-offset', `${px}px`);
    if (stuck) setDock(measureDashDock());
  }, [stuck]);

  useEffect(() => {
    syncLayout();
    window.addEventListener('resize', syncLayout);
    return () => window.removeEventListener('resize', syncLayout);
  }, [syncLayout]);

  const updateStuck = useCallback(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // Pin only after the bar scrolls past the app header — not when the sentinel is still below the fold.
    const top = el.getBoundingClientRect().top;
    const next = top < headerOffset + 1;
    setStuck(prev => {
      if (next && !prev) setDock(measureDashDock());
      return next;
    });
  }, [headerOffset]);

  useEffect(() => {
    updateStuck();
    window.addEventListener('scroll', updateStuck, { passive: true });
    window.addEventListener('resize', updateStuck);
    return () => {
      window.removeEventListener('scroll', updateStuck);
      window.removeEventListener('resize', updateStuck);
    };
  }, [updateStuck]);

  useEffect(() => {
    if (!stuck) return;
    const onScroll = () => setDock(measureDashDock());
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [stuck]);

  useEffect(() => {
    const node = inFlowRef.current;
    if (!node) return;
    const ro = new ResizeObserver(() => setBarHeight(node.offsetHeight));
    ro.observe(node);
    setBarHeight(node.offsetHeight);
    return () => ro.disconnect();
  }, [stuck, currentAccount?.updatedAt, periodLabel, isEmptyForRange]);

  const contentProps: BarContentProps = {
    periodLabel,
    isEmptyForRange,
    showSyncFooter: Boolean(currentAccount?.updatedAt) && !stuck,
    currentAccount,
    dateStart,
    dateEnd,
    anchor,
    dataStart,
    dataEnd,
    onRangeChange,
    availableYears,
    availableMonthsByYear,
  };

  const pinnedBar: ReactNode = (
    <div
      className='tt-time-nav-portal'
      data-stuck='true'
      style={{ top: headerOffset, left: dock.left, width: dock.width }}
      role='region'
      aria-label='Period filters'
    >
      <TimeNavBarContent {...contentProps} showSyncFooter={false} />
    </div>
  );

  return (
    <>
      <div ref={sentinelRef} className='pointer-events-none h-px w-full' aria-hidden />
      <div
        ref={inFlowRef}
        className='tt-time-nav-sticky'
        data-stuck='false'
        style={stuck ? { height: barHeight, visibility: 'hidden' } : undefined}
        aria-hidden={stuck}
      >
        <TimeNavBarContent {...contentProps} />
      </div>
      {stuck && typeof document !== 'undefined'
        ? createPortal(pinnedBar, document.body)
        : null}
    </>
  );
}
