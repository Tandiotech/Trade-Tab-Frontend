import { BiBookOpen, BiCheck } from 'react-icons/bi';
import { IoIosFlag } from 'react-icons/io';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import type { JournalEntryStatus, ResolvedJournalCell } from '../journalCellState';

export type JournalCalendarCellProps = {
  day: number;
  resolved: ResolvedJournalCell;
  pnl: number;
  tradeCount: number;
  relativeValues: boolean;
  balance: number;
  withdrawalAmount?: number;
  journalStatus?: JournalEntryStatus;
  hasJournalEntry?: boolean;
  journalPriority?: 'low' | 'medium' | 'high';
  isHighlighted?: boolean;
  isHovered?: boolean;
  accountCurrency?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const kindClass: Record<ResolvedJournalCell['kind'], string> = {
  adjacentMonth: 'tt-journal-cell tt-journal-cell--adjacent',
  futureIdle: 'tt-journal-cell tt-journal-cell--future',
  futureSltTarget: 'tt-journal-cell tt-journal-cell--future tt-journal-cell--slt',
  pastNoTrades: 'tt-journal-cell tt-journal-cell--neutral',
  pastWin: 'tt-journal-cell tt-journal-cell--win',
  pastLoss: 'tt-journal-cell tt-journal-cell--loss',
  pastBreakeven: 'tt-journal-cell tt-journal-cell--neutral',
  todayNoTrades: 'tt-journal-cell tt-journal-cell--neutral tt-journal-cell--today',
  todayWin: 'tt-journal-cell tt-journal-cell--win tt-journal-cell--today',
  todayLoss: 'tt-journal-cell tt-journal-cell--loss tt-journal-cell--today',
  todayBreakeven: 'tt-journal-cell tt-journal-cell--neutral tt-journal-cell--today',
  sltStart: 'tt-journal-cell tt-journal-cell--slt-start',
  withdrawal: 'tt-journal-cell tt-journal-cell--withdrawal',
};

function formatPnl(
  pnl: number,
  balance: number,
  relativeValues: boolean,
  withdrawalAmount?: number,
  isWithdrawal?: boolean
): string {
  if (isWithdrawal && withdrawalAmount != null) {
    return SeparadorDecimal(withdrawalAmount.toFixed(2));
  }
  if (relativeValues && balance > 0) {
    return `${((pnl * 100) / balance).toFixed(2)}%`;
  }
  return SeparadorDecimal(pnl.toFixed(2));
}

export default function JournalCalendarCell({
  day,
  resolved,
  pnl,
  tradeCount,
  relativeValues,
  balance,
  withdrawalAmount,
  journalStatus = 'none',
  hasJournalEntry = false,
  journalPriority = 'low',
  isHighlighted = false,
  isHovered = false,
  accountCurrency = 'USD',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: JournalCalendarCellProps) {
  const { kind } = resolved;
  const isWithdrawal = kind === 'withdrawal';

  const ariaLabel = [
    `${day}`,
    resolved.isFuture ? 'upcoming' : resolved.isToday ? 'today' : 'past',
    tradeCount > 0 ? `${tradeCount} trades` : 'no trades',
    pnl !== 0 ? `P&L ${pnl.toFixed(2)}` : '',
    hasJournalEntry ? 'journal logged' : journalPriority === 'high' ? 'journal suggested' : '',
  ]
    .filter(Boolean)
    .join(', ');

  const renderBody = () => {
    if (kind === 'sltStart') {
      return (
        <div className='flex flex-col items-center gap-0.5 text-[var(--tt-brand)]'>
          <IoIosFlag className='h-4 w-4' aria-hidden />
          <span className='text-[10px] font-semibold uppercase tracking-wide'>SLT start</span>
        </div>
      );
    }

    if (kind === 'futureSltTarget' && resolved.dailySltTargetDisplay) {
      return (
        <div className='text-center'>
          <p className='text-[9px] uppercase tracking-wide text-[var(--tt-fg-3)]'>Target</p>
          <p className='tt-mono text-xs font-semibold text-[var(--tt-fg-0)]'>
            {resolved.dailySltTargetDisplay}
          </p>
          <p className='text-[9px] text-[var(--tt-fg-3)]'>{accountCurrency}</p>
        </div>
      );
    }

    if (kind === 'futureIdle') {
      return <span className='text-sm text-[var(--tt-fg-3)]'>—</span>;
    }

    if (kind === 'adjacentMonth') {
      return null;
    }

    if (tradeCount === 0 && !isWithdrawal) {
      return (
        <span className='text-[10px] text-[var(--tt-fg-3)] md:text-xs'>No trades</span>
      );
    }

    return (
      <div className='text-center'>
        <p className='tt-mono text-xs font-semibold text-[var(--tt-fg-0)] md:text-sm'>
          {formatPnl(pnl, balance, relativeValues, withdrawalAmount, isWithdrawal)}
        </p>
        <p className='text-[9px] text-[var(--tt-fg-3)] md:text-[10px]'>{accountCurrency}</p>
        {!isWithdrawal && tradeCount > 0 && (
          <p className='mt-0.5 text-[9px] text-[var(--tt-fg-2)] md:text-[10px]'>
            {tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}
          </p>
        )}
        {isWithdrawal && (
          <p className='mt-0.5 text-[9px] font-medium text-[var(--tt-fg-2)]'>Withdraw</p>
        )}
      </div>
    );
  };

  return (
    <button
      type='button'
      disabled={!resolved.isClickable && !onClick}
      onClick={resolved.isClickable ? onClick : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      className={[
        kindClass[kind],
        isHighlighted ? 'tt-journal-cell--highlighted' : '',
        isHovered && resolved.isClickable ? 'tt-journal-cell--hover' : '',
        !resolved.isClickable ? 'cursor-default' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className='tt-journal-cell__day'>{day}</span>

      {hasJournalEntry && (
        <span
          className={`tt-journal-cell__badge ${
            journalStatus === 'complete'
              ? 'tt-journal-cell__badge--complete'
              : journalStatus === 'partial'
                ? 'tt-journal-cell__badge--partial'
                : 'tt-journal-cell__badge--draft'
          }`}
          aria-hidden
        >
          {journalStatus === 'complete' ? (
            <BiCheck className='h-2.5 w-2.5' />
          ) : (
            <BiBookOpen className='h-2.5 w-2.5' />
          )}
        </span>
      )}

      {!hasJournalEntry && journalPriority === 'high' && resolved.isPast && (
        <span className='tt-journal-cell__priority-dot' aria-hidden />
      )}

      <div className='tt-journal-cell__body'>{renderBody()}</div>
    </button>
  );
}
