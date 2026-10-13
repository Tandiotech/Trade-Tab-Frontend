import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { monthRangeYMD } from '@/pages/metrics/utils/metricsDateRange';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface PeriodMorePopoverProps {
  dateStart: string | null;
  dateEnd: string | null;
  availableYears: number[];
  availableMonthsByYear: Map<number, Set<number>>;
  onRange: (start: string, end: string) => void;
  compact?: boolean;
}

export function PeriodMorePopover({
  dateStart,
  dateEnd,
  availableYears,
  availableMonthsByYear,
  onRange,
  compact = false,
}: PeriodMorePopoverProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => availableYears[0] ?? new Date().getUTCFullYear());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (availableYears.length && !availableYears.includes(year)) {
      setYear(availableYears[0]);
    }
  }, [availableYears, year]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const stepYear = (delta: number) => {
    const idx = availableYears.indexOf(year);
    const next = availableYears[idx + delta];
    if (next != null) setYear(next);
  };

  const canPrev = availableYears.indexOf(year) < availableYears.length - 1;
  const canNext = availableYears.indexOf(year) > 0;

  return (
    <div ref={rootRef} className='relative shrink-0'>
      <button
        type='button'
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup='dialog'
        className={cn(
          'tt-btn tt-btn-sm inline-flex items-center gap-0.5 font-semibold',
          compact
            ? 'min-h-7 rounded-full px-2 py-0.5 text-[10px]'
            : 'min-h-8 gap-1 px-2.5 py-1 text-[11px] sm:min-h-9 sm:text-xs',
          open
            ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
            : 'tt-btn-ghost text-[var(--tt-fg-2)] hover:border-[var(--tt-line-2)]'
        )}
      >
        More
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role='dialog'
            aria-label='Pick month and year'
            className='absolute right-0 top-full z-[120] mt-1.5 w-[min(100vw-2rem,17rem)] rounded-xl border border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-3 shadow-xl'
          >
            <div className='mb-3 flex items-center justify-between gap-2'>
              <button
                type='button'
                disabled={!canPrev}
                onClick={() => stepYear(1)}
                className='flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--tt-line-1)] text-[var(--tt-fg-2)] hover:bg-[oklch(1_0_0_/0.05)] disabled:opacity-40'
                aria-label='Previous year'
              >
                <ChevronLeft className='h-4 w-4' />
              </button>
              <span className='text-sm font-semibold tabular-nums text-[var(--tt-fg-0)]'>{year}</span>
              <button
                type='button'
                disabled={!canNext}
                onClick={() => stepYear(-1)}
                className='flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--tt-line-1)] text-[var(--tt-fg-2)] hover:bg-[oklch(1_0_0_/0.05)] disabled:opacity-40'
                aria-label='Next year'
              >
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>

            <div className='grid grid-cols-3 gap-1.5'>
              {MONTH_LABELS.map((label, monthIndex) => {
                const hasData = availableMonthsByYear.get(year)?.has(monthIndex) ?? false;
                const { start, end } = monthRangeYMD(year, monthIndex);
                const isActive = dateStart === start && dateEnd === end;

                return (
                  <button
                    key={label}
                    type='button'
                    disabled={!hasData}
                    onClick={() => {
                      onRange(start, end);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg border px-2 py-2 text-xs font-semibold transition-colors',
                      isActive
                        ? 'border-[var(--tt-brand)] bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
                        : hasData
                          ? 'border-[var(--tt-line-1)] text-[var(--tt-fg-1)] hover:border-[var(--tt-brand)]/40 hover:bg-[oklch(1_0_0_/0.04)]'
                          : 'cursor-not-allowed border-[var(--tt-line-1)]/50 text-[var(--tt-fg-3)] opacity-45'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
