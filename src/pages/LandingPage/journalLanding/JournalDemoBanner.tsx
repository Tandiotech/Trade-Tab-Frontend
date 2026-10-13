import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function JournalDemoBanner() {
  return (
    <div
      className='mx-auto mb-4 flex max-w-7xl flex-col gap-3 rounded-xl border border-[var(--tt-brand)]/30 bg-[var(--tt-brand-dim)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between'
      role='status'
    >
      <div className='flex min-w-0 items-start gap-2.5 sm:items-center'>
        <Sparkles className='mt-0.5 h-4 w-4 shrink-0 text-[var(--tt-brand)] sm:mt-0' aria-hidden />
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-[var(--tt-fg-0)]'>Sample journal data</p>
          <p className='text-xs text-[var(--tt-fg-2)]'>
            Interactive demo — connect your broker to auto-import trades and track psychology.
          </p>
        </div>
      </div>
      <Link
        to='/signup'
        className='tt-btn tt-btn-primary shrink-0 self-start sm:self-center no-underline'
      >
        Connect free
      </Link>
    </div>
  );
}
