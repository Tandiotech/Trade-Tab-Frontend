import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import { useState } from 'react';
import { CellTradeListProps } from '../../../component/interfaces/intefaces';
import TradeDetailsChart from './TradeDetailsChart';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon } from '@heroicons/react/24/outline';

const CellTradeList: React.FC<CellTradeListProps> = ({ trades }) => {
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTradeId(expandedTradeId === id ? null : id);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const calculateDuration = (openTime: string, closeTime: string) => {
    try {
      const openDate = new Date(openTime);
      const closeDate = new Date(closeTime);
      if (Number.isNaN(openDate.getTime()) || Number.isNaN(closeDate.getTime())) return 0;
      return Math.round((closeDate.getTime() - openDate.getTime()) / (1000 * 60));
    } catch {
      return 0;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return '—';
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const processedTrades =
    trades?.map(trade => ({
      ...trade,
      success: trade.profit > 0 ? 'won' : 'lost',
      durationInMinutes: calculateDuration(trade.openTime, trade.closeTime),
      formattedOpenTime: formatDateTime(trade.openTime),
      formattedCloseTime: formatDateTime(trade.closeTime),
    })) ?? [];

  const winCount = processedTrades.filter(t => t.success === 'won').length;

  if (!processedTrades.length) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <p className='text-sm font-medium text-[var(--tt-fg-1)]'>No trades this day</p>
        <p className='mt-1 text-xs text-[var(--tt-fg-3)]'>Pick another date on the calendar</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-end justify-between gap-2'>
        <div>
          <h3 className='text-sm font-semibold text-[var(--tt-fg-0)]'>Trades</h3>
          <p className='mt-0.5 text-xs text-[var(--tt-fg-3)]'>
            {processedTrades.length} total · {winCount} win{winCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <ul className='flex max-h-[min(52vh,520px)] flex-col gap-2 overflow-y-auto pr-0.5'>
        {processedTrades.map(trade => {
          const isWin = trade.profit > 0;
          const isBuy = trade.type === 'DEAL_TYPE_BUY';
          const isExpanded = expandedTradeId === trade._id;

          return (
            <li
              key={trade._id}
              className={`tt-journal-trade ${isWin ? 'tt-journal-trade--win' : 'tt-journal-trade--loss'} ${
                isExpanded ? 'tt-journal-trade--expanded' : ''
              }`}
            >
              <button
                type='button'
                className='flex w-full flex-col gap-2 p-3 text-left sm:flex-row sm:items-center sm:justify-between'
                onClick={() => toggleExpand(trade._id)}
                aria-expanded={isExpanded}
              >
                <div className='flex min-w-0 flex-wrap items-center gap-2'>
                  <span className='text-sm font-semibold text-[var(--tt-fg-0)]'>{trade.symbol}</span>
                  <span className={`tt-journal-chip ${isBuy ? 'tt-journal-chip--buy' : 'tt-journal-chip--sell'}`}>
                    {isBuy ? 'Long' : 'Short'}
                  </span>
                  <span className={`tt-journal-chip ${isWin ? 'tt-journal-chip--win' : 'tt-journal-chip--loss'}`}>
                    {isWin ? 'Win' : 'Loss'}
                  </span>
                </div>

                <div className='flex items-center justify-between gap-3 sm:justify-end'>
                  <div className='flex items-center gap-3 text-xs text-[var(--tt-fg-3)]'>
                    <span className='inline-flex items-center gap-1'>
                      <ClockIcon className='h-3.5 w-3.5' />
                      {formatDuration(trade.durationInMinutes)}
                    </span>
                    <span className='tt-mono'>Vol {trade.volume}</span>
                  </div>
                  <span
                    className={`tt-mono text-sm font-semibold ${
                      isWin ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                    }`}
                  >
                    {trade.profit >= 0 ? '+' : ''}
                    {SeparadorDecimal(trade.profit.toFixed(2))}
                  </span>
                  {isExpanded ? (
                    <ChevronUpIcon className='h-4 w-4 shrink-0 text-[var(--tt-fg-3)]' />
                  ) : (
                    <ChevronDownIcon className='h-4 w-4 shrink-0 text-[var(--tt-fg-3)]' />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className='overflow-visible border-t border-[var(--tt-line-1)] bg-[var(--tt-bg-1)] p-3 pb-4'>
                  <div className='mb-3 grid grid-cols-2 gap-2'>
                    <div className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-2.5'>
                      <p className='text-[0.625rem] font-medium uppercase tracking-wide text-[var(--tt-fg-3)]'>
                        Entry
                      </p>
                      <p className='tt-mono mt-1 text-sm font-semibold text-[var(--tt-fg-0)]'>{trade.openPrice}</p>
                      <p className='mt-0.5 text-[0.6875rem] text-[var(--tt-fg-3)]'>{trade.formattedOpenTime}</p>
                    </div>
                    <div className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-2.5'>
                      <p className='text-[0.625rem] font-medium uppercase tracking-wide text-[var(--tt-fg-3)]'>
                        Exit
                      </p>
                      <p className='tt-mono mt-1 text-sm font-semibold text-[var(--tt-fg-0)]'>{trade.closePrice}</p>
                      <p className='mt-0.5 text-[0.6875rem] text-[var(--tt-fg-3)]'>{trade.formattedCloseTime}</p>
                    </div>
                  </div>

                  <div className='mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4'>
                    {[
                      { label: 'Pips', value: trade.pips },
                      { label: 'Duration', value: formatDuration(trade.durationInMinutes) },
                      { label: 'Volume', value: trade.volume },
                      {
                        label: 'Profit',
                        value: `${trade.profit >= 0 ? '+' : ''}${SeparadorDecimal(trade.profit.toFixed(2))}`,
                        accent: isWin ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]',
                      },
                    ].map(metric => (
                      <div key={metric.label} className='tt-journal-metric'>
                        <div className={`tt-journal-metric__value ${metric.accent ?? ''}`}>{metric.value}</div>
                        <div className='tt-journal-metric__label'>{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className='grid grid-cols-3 gap-2'>
                    {[
                      { label: 'Commission', value: trade.commission ?? '—' },
                      { label: 'Swap', value: trade.swap ?? '—' },
                      { label: 'Status', value: trade.isOpen ? 'Open' : 'Closed' },
                    ].map(item => (
                      <div key={item.label} className='tt-journal-metric'>
                        <div className='tt-journal-metric__value'>{item.value}</div>
                        <div className='tt-journal-metric__label'>{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-3'>
                    <TradeDetailsChart trades={[trade]} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CellTradeList;
