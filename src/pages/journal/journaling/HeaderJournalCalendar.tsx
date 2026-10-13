import { useEffect, useState } from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { IoTodayOutline } from 'react-icons/io5';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import { useJournalContext } from '@/context/JournalProvider';
import type { JournalMonthData } from '../hooks/useJournalMonth';

type HeaderJournalCalendarProps = {
  currentMonth: number;
  setCurrentMonth: (fn: (prev: number) => number) => void;
  currentYear: number;
  setCurrentYear: (fn: (prev: number) => number) => void;
  totalPnl: number;
  monthData: JournalMonthData;
};

export default function HeaderJournalCalendar({
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear,
  totalPnl,
  monthData,
}: HeaderJournalCalendarProps) {
  const [currentMonthName, setCurrentMonthName] = useState('');
  const { setHighlightedDay } = useJournalContext();

  const { lastActivityDate, hasActivityInMonth } = monthData;

  useEffect(() => {
    setCurrentMonthName(
      new Date(currentYear, currentMonth - 1, 1).toLocaleString('en-US', { month: 'long' })
    );
  }, [currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth: number) => (prevMonth - 1 < 1 ? 12 : prevMonth - 1));
    setCurrentYear((prevYear: number) => (currentMonth === 1 ? prevYear - 1 : prevYear));
    setHighlightedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth: number) => (prevMonth + 1 > 12 ? 1 : prevMonth + 1));
    setCurrentYear((prevYear: number) => (currentMonth === 12 ? prevYear + 1 : prevYear));
    setHighlightedDay(null);
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(() => new Date().getMonth() + 1);
    setCurrentYear(() => new Date().getFullYear());
    setHighlightedDay(null);
  };

  const jumpToLastActivity = () => {
    if (!lastActivityDate) return;
    setCurrentMonth(() => lastActivityDate.month);
    setCurrentYear(() => lastActivityDate.year);
    setHighlightedDay(lastActivityDate.day);
  };

  const isViewingCurrentMonth =
    currentMonth === new Date().getMonth() + 1 && currentYear === new Date().getFullYear();

  const lastActivityLabel = lastActivityDate
    ? new Date(
        lastActivityDate.year,
        lastActivityDate.month - 1,
        lastActivityDate.day
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const showEmptyBanner = !hasActivityInMonth && lastActivityDate;

  return (
    <header className='mb-3 space-y-2'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-sm font-semibold text-[var(--tt-fg-0)] md:text-lg'>P&amp;L Calendar</h3>
          <p className='text-xs text-[var(--tt-fg-3)]'>Daily performance at a glance</p>
        </div>

        <div className='flex items-center justify-center gap-3 text-[var(--tt-fg-1)]'>
          <button
            type='button'
            onClick={goToPreviousMonth}
            className='rounded-lg p-1 text-[var(--tt-brand)] transition-colors hover:bg-[var(--tt-bg-2)]'
            aria-label='Previous month'
          >
            <MdArrowBackIosNew className='text-xl' />
          </button>

          <div className='flex min-w-[9rem] items-center justify-center gap-2'>
            {!isViewingCurrentMonth && (
              <button
                type='button'
                onClick={goToCurrentMonth}
                className='rounded-lg p-1 text-[var(--tt-brand)] hover:bg-[var(--tt-bg-2)]'
                aria-label='Go to current month'
              >
                <IoTodayOutline className='text-lg' />
              </button>
            )}
            <span className='text-sm font-medium text-[var(--tt-fg-0)] md:text-base'>
              {currentMonthName} {currentYear}
            </span>
          </div>

          <button
            type='button'
            onClick={goToNextMonth}
            className='rounded-lg p-1 text-[var(--tt-brand)] transition-colors hover:bg-[var(--tt-bg-2)]'
            aria-label='Next month'
          >
            <MdArrowForwardIos className='text-xl' />
          </button>
        </div>

        <div className='text-right'>
          <p className='text-[10px] uppercase tracking-wide text-[var(--tt-fg-3)]'>Month P&amp;L</p>
          <p
            className={`tt-mono text-sm font-bold md:text-lg ${
              totalPnl >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
            }`}
          >
            {totalPnl > 0 ? '+' : ''}
            {SeparadorDecimal(totalPnl.toFixed(2))}
          </p>
        </div>
      </div>

      {showEmptyBanner && (
        <div className='tt-journal-banner flex flex-wrap items-center justify-between gap-2'>
          <span>
            No trades in {currentMonthName}. Last activity: {lastActivityLabel}
          </span>
          <button
            type='button'
            onClick={jumpToLastActivity}
            className='shrink-0 rounded-lg border border-[var(--tt-brand-dim)] bg-[var(--tt-brand-dim)] px-3 py-1 text-xs font-medium text-[var(--tt-brand)] transition-colors hover:border-[var(--tt-brand)]'
          >
            Jump to last trade
          </button>
        </div>
      )}
    </header>
  );
}
