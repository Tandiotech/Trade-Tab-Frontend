import GlobalModal from '@/component/modal/GlobalModal';
import CellTradeList from './CellTradeList';
import ConfirmWithdrawalModal from './ConfirmWithdrawalModal';
import JournalDayFeedback from './JournalDayFeedback';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import { XMarkIcon } from '@heroicons/react/24/outline';

type JournalModalsProps = {
  modalWithdrawal: boolean;
  modalTrades: boolean;
  modalEmotional: boolean;
  setModalTrades: (v: boolean) => void;
  setModalWithdrawal: (v: boolean) => void;
  setModalEmotional: (v: boolean) => void;
  trades?: unknown[];
  date_selected: string;
  journalData?: Record<string, unknown>;
  pnlForDay?: number;
  tradeCountForDay?: number;
  onJournalUpdate?: (day: number, data: Record<string, unknown>) => void;
};

function formatModalDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

const JournalModals = ({
  modalWithdrawal,
  trades,
  modalEmotional,
  setModalTrades,
  setModalWithdrawal,
  setModalEmotional,
  date_selected,
  journalData,
  pnlForDay,
  tradeCountForDay,
  onJournalUpdate,
}: JournalModalsProps) => {
  const showJournalCta =
    (tradeCountForDay ?? 0) > 0 && !journalData?.selectedFeeling;
  const hasTrades = (tradeCountForDay ?? 0) > 0;
  const pnl = pnlForDay ?? 0;

  return (
    <>
      <GlobalModal
        variant='tt'
        isActive={modalEmotional}
        onClose={() => setModalEmotional(false)}
        height='max-h-[min(90vh,880px)]'
        width='w-full'
      >
        <header className='tt-journal-modal__header'>
          <div className='min-w-0'>
            <p className='text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--tt-fg-3)]'>
              Trading day
            </p>
            <h2 className='mt-0.5 truncate text-lg font-semibold tracking-tight text-[var(--tt-fg-0)] md:text-xl'>
              {formatModalDate(date_selected)}
            </h2>
            {hasTrades && (
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <span
                  className={`tt-mono rounded-md px-2 py-0.5 text-sm font-semibold ${
                    pnl >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                  }`}
                >
                  {pnl >= 0 ? '+' : ''}
                  {SeparadorDecimal(pnl.toFixed(2))}
                </span>
                <span className='text-xs text-[var(--tt-fg-3)]'>
                  {tradeCountForDay} {tradeCountForDay === 1 ? 'trade' : 'trades'}
                </span>
                {showJournalCta && (
                  <span className='rounded-full border border-[var(--tt-brand-dim)] bg-[var(--tt-brand-dim)] px-2 py-0.5 text-[0.6875rem] font-medium text-[var(--tt-brand)]'>
                    Journal pending
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            type='button'
            onClick={() => setModalEmotional(false)}
            className='shrink-0 rounded-lg p-2 text-[var(--tt-fg-3)] transition-colors hover:bg-[var(--tt-bg-2)] hover:text-[var(--tt-fg-0)]'
            aria-label='Close'
          >
            <XMarkIcon className='h-5 w-5' />
          </button>
        </header>

        <div className='tt-journal-modal__body'>
          <section className='tt-journal-modal__pane tt-journal-modal__pane--trades'>
            <CellTradeList trades={trades} />
          </section>
          <section className='tt-journal-modal__pane'>
            <JournalDayFeedback
              date_selected={date_selected}
              onClose={() => setModalEmotional(false)}
              openTrades={() => setModalTrades(true)}
              existingJournalData={journalData}
              onJournalUpdate={onJournalUpdate}
            />
          </section>
        </div>
      </GlobalModal>

      <GlobalModal
        variant='tt'
        isActive={modalWithdrawal}
        onClose={() => setModalWithdrawal(false)}
        height='h-fit max-h-[90vh]'
        width='w-full max-w-md'
      >
        <div className='p-5'>
          <ConfirmWithdrawalModal
            onClose={() => setModalWithdrawal(false)}
            date_selected={date_selected}
          />
        </div>
      </GlobalModal>
    </>
  );
};

export default JournalModals;
