import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ApplicationForm from '../form/ApplicationForm';
import { formatJobLocation } from './jobsCareers.types';
import type { SelectedJobLocation } from './jobsCareers.types';

type Props = {
  open: boolean;
  selectedLocation: SelectedJobLocation | null;
  onClose: () => void;
};

export function JobsApplicationDrawer({ open, selectedLocation, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const locationLabel = formatJobLocation(selectedLocation);

  return (
    <div
      className='fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4'
      role='presentation'
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='careers-application-title'
        className='tt-panel flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden sm:max-h-[88vh] sm:rounded-xl'
        onClick={e => e.stopPropagation()}
      >
        <header className='flex shrink-0 items-start justify-between gap-4 border-b border-[var(--tt-line-1)] px-4 py-4 md:px-6'>
          <div className='min-w-0'>
            <h2 id='careers-application-title' className='text-xl font-bold text-[var(--tt-fg-0)] md:text-2xl'>
              Join TradeTab
            </h2>
            <p className='mt-1 text-sm text-[var(--tt-fg-2)]'>
              Hub: <span className='font-medium text-[var(--tt-brand)]'>{locationLabel}</span>
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--tt-line-1)] text-[var(--tt-fg-2)] transition-colors hover:bg-[var(--tt-bg-2)] hover:text-[var(--tt-fg-0)]'
            aria-label='Close application'
          >
            <X className='h-5 w-5' />
          </button>
        </header>
        <div className='min-h-0 flex-1 overflow-y-auto p-4 md:p-6'>
          <ApplicationForm
            key={locationLabel}
            closeForm={onClose}
            initialLocation={locationLabel}
          />
        </div>
      </div>
    </div>
  );
}
