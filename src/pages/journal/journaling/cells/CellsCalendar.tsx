import { useState } from 'react';
import { useJournalContext } from '@/context/JournalProvider';
import JournalCalendarCell from '../../components/JournalCalendarCell';
import { resolveJournalCell } from '../../journalCellState';
import EconomicEventDetail from './EconomicEventDetail';
import type { CellsCalendarProps } from './InterfaceCellsCalendar';

const CellsCalendar: React.FC<CellsCalendarProps> = ({
  tradesData,
  currentMonth,
  balance = 0,
  currentYear,
  pnlData,
  i,
  today,
  withdrawalPlanMode,
  stlPlan,
  withdrawalData,
  isWithdrawalDate,
  setModalWithdrawal,
  setModalEmotional,
  setCurrentPosition,
  currentAccount,
  economicEvent,
  journalStatus = 'none',
  journalPriority = 'low',
  hasJournalEntry = false,
  onHover,
  isHovered = false,
}) => {
  const pnlValue = pnlData?.[i] ?? 0;
  const tradesOfTheDay = tradesData?.[i] ?? 0;
  const { relativeValues, highlightedDay } = useJournalContext();
  const [showEconomicDetail, setShowEconomicDetail] = useState(false);

  const resolved = resolveJournalCell({
    day: i,
    month: currentMonth,
    year: currentYear,
    today,
    pnl: pnlValue,
    tradeCount: tradesOfTheDay,
    balance,
    stlPlan,
    isWithdrawalDate: !!isWithdrawalDate,
    hasJournalEntry: !!hasJournalEntry,
    journalStatus,
    journalPriority,
    useRelativeValues: relativeValues,
  });

  const handleClick = () => {
    if (withdrawalPlanMode && resolved.isFuture) {
      setModalWithdrawal(true);
      setCurrentPosition(i);
      return;
    }
    if (resolved.isClickable) {
      setCurrentPosition(i);
      setModalEmotional(true);
    }
  };

  return (
    <div className='relative h-full w-full min-h-0' onMouseEnter={() => onHover?.(i)} onMouseLeave={() => onHover?.(null)}>
      <JournalCalendarCell
        day={i}
        resolved={resolved}
        pnl={pnlValue}
        tradeCount={tradesOfTheDay}
        relativeValues={relativeValues}
        balance={balance}
        withdrawalAmount={withdrawalData?.amount}
        journalStatus={journalStatus}
        hasJournalEntry={!!hasJournalEntry}
        journalPriority={journalPriority}
        isHighlighted={highlightedDay === i}
        isHovered={isHovered}
        accountCurrency={currentAccount?.currency ?? 'USD'}
        onClick={handleClick}
      />

      {economicEvent && !showEconomicDetail && (
        <button
          type='button'
          onClick={e => {
            e.stopPropagation();
            setShowEconomicDetail(true);
          }}
          className='absolute bottom-1.5 right-1.5 hidden h-2 w-2 rounded-full bg-[var(--tt-brand)] ring-2 ring-[var(--tt-bg-1)] md:block'
          aria-label={`Economic event: ${economicEvent.event}`}
        />
      )}

      {showEconomicDetail && economicEvent && (
        <EconomicEventDetail
          event={economicEvent.event}
          date={economicEvent.date}
          dayNumber={i}
          importance={economicEvent.importance}
          impactProbability={Math.floor(Math.random() * 50) + 50}
          onClose={() => setShowEconomicDetail(false)}
        />
      )}
    </div>
  );
};

export default CellsCalendar;
