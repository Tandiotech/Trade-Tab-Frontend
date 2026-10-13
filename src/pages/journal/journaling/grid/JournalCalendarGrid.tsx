import { useState } from 'react';
import CellsCalendar from '../cells/CellsCalendar';
import { useMTAccounts } from '@/context/accounts/MTAccountsContext';
import { renderNextMonthCells, renderPreviousMonthCells } from './renderPreviousMonthCells';
import JournalModals from '../JournalModals';
import { useJournalEmotions } from '../../hooks/useJournalEmotions';
import type { StlPlanLike } from '../../journalCellState';

type JournalCalendarGridProps = {
  tradesData: Record<number, number>;
  tradesHistory: Record<number, unknown[]>;
  currentMonth: number;
  currentYear: number;
  balance: number;
  stlPlan: StlPlanLike;
  pnlData: Record<number, number>;
  withdrawalDate: number;
  withdrawalMonth: number;
  withdrawalInformation: Record<string, unknown> | null;
  withdrawalPlanMode: boolean;
  economicCalendar: Array<{ date: string; event: string; importance: string }>;
};

const ROWS = 6;
const COLS = 7;

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export default function JournalCalendarGrid({
  tradesData,
  tradesHistory,
  currentMonth,
  currentYear,
  balance,
  stlPlan,
  pnlData,
  withdrawalDate,
  withdrawalMonth,
  withdrawalInformation,
  withdrawalPlanMode,
  economicCalendar,
}: JournalCalendarGridProps) {
  const [modalWithdrawal, setModalWithdrawal] = useState(false);
  const [modalTrades, setModalTrades] = useState(false);
  const [modalEmotional, setModalEmotional] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const { currentAccount } = useMTAccounts();
  const { byDay, getJournalStatus, hasEntry, updateDay, refetch } = useJournalEmotions(
    currentAccount?._id,
    currentMonth,
    currentYear
  );

  const getJournalPriority = (day: number): 'low' | 'medium' | 'high' => {
    const pnlValue = pnlData?.[day] ?? 0;
    const tradesCount = tradesData?.[day] ?? 0;
    if (pnlValue < 0 && tradesCount > 0) return 'high';
    if (tradesCount > 0) return 'medium';
    return 'low';
  };

  const generateCurrentMonthCells = () => {
    const daysCount = daysInMonth(currentMonth, currentYear);
    const today = new Date();
    const cells = [];

    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      const isFutureDate = date > today;
      const isWithdrawalDate = withdrawalDate === i && withdrawalMonth === currentMonth;
      const withdrawalData = isWithdrawalDate ? withdrawalInformation : {};

      const eventForDay = economicCalendar.find(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === currentYear &&
          eventDate.getMonth() === currentMonth - 1 &&
          eventDate.getDate() === i
        );
      });

      cells.push(
        <CellsCalendar
          tradesData={tradesData}
          key={`cell-${i}`}
          i={i}
          balance={balance}
          currentMonth={currentMonth}
          currentYear={currentYear}
          pnlData={pnlData}
          today={today}
          isFutureDate={isFutureDate}
          stlPlan={stlPlan}
          withdrawalPlanMode={withdrawalPlanMode}
          isWithdrawalDate={isWithdrawalDate}
          withdrawalData={withdrawalData}
          setModalWithdrawal={setModalWithdrawal}
          setModalEmotional={setModalEmotional}
          setCurrentPosition={setCurrentPosition}
          currentAccount={currentAccount}
          economicEvent={eventForDay || null}
          journalStatus={getJournalStatus(i)}
          journalPriority={getJournalPriority(i)}
          hasJournalEntry={hasEntry(i)}
          journalData={byDay[i]}
          onHover={setHoveredCell}
          isHovered={hoveredCell === i}
        />
      );
    }

    return cells;
  };

  const generateCells = () => {
    const daysCount = daysInMonth(currentMonth, currentYear);
    const startDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const prevMonthDaysCount = daysInMonth(
      currentMonth - 1 < 1 ? 12 : currentMonth - 1,
      currentMonth - 1 < 1 ? currentYear - 1 : currentYear
    );

    const prevMonthCells = renderPreviousMonthCells(startDay, prevMonthDaysCount);
    const currentMonthCells = generateCurrentMonthCells();
    const remainingCells = ROWS * COLS - (prevMonthCells.length + currentMonthCells.length);
    const nextMonthCells = renderNextMonthCells(remainingCells);

    return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
  };

  return (
    <>
      <JournalModals
        modalTrades={modalTrades}
        modalWithdrawal={modalWithdrawal}
        modalEmotional={modalEmotional}
        setModalTrades={setModalTrades}
        setModalWithdrawal={setModalWithdrawal}
        setModalEmotional={setModalEmotional}
        trades={currentPosition ? tradesHistory[currentPosition] : undefined}
        date_selected={
          currentPosition
            ? new Date(currentYear, currentMonth - 1, currentPosition).toDateString()
            : ''
        }
        journalData={currentPosition ? byDay[currentPosition] : undefined}
        pnlForDay={currentPosition ? pnlData[currentPosition] : undefined}
        tradeCountForDay={currentPosition ? tradesData[currentPosition] : undefined}
        onJournalUpdate={(day: number, data: Parameters<typeof updateDay>[1]) => {
          updateDay(day, data);
          refetch();
        }}
      />

      {generateCells()}
    </>
  );
}
