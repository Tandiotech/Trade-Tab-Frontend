import JournalCalendarCell from '../../components/JournalCalendarCell';
import { resolveJournalCell } from '../../journalCellState';

const adjacentResolved = (day: number) =>
  resolveJournalCell({
    day,
    month: 1,
    year: 2000,
    today: new Date(),
    pnl: 0,
    tradeCount: 0,
    balance: 0,
    stlPlan: null,
    isWithdrawalDate: false,
    isAdjacentMonth: true,
  });

export const renderPreviousMonthCells = (startDay: number, prevMonthDaysCount: number) => {
  const cells = [];
  for (let i = prevMonthDaysCount - startDay + 1; i <= prevMonthDaysCount; i++) {
    cells.push(
      <JournalCalendarCell
        key={`prev-month-cell-${i}`}
        day={i}
        resolved={adjacentResolved(i)}
        pnl={0}
        tradeCount={0}
        relativeValues={false}
        balance={0}
      />
    );
  }
  return cells;
};

export const renderNextMonthCells = (remainingCells: number) => {
  const cells = [];
  for (let i = 1; i <= remainingCells; i++) {
    cells.push(
      <JournalCalendarCell
        key={`next-month-cell-${i}`}
        day={i}
        resolved={adjacentResolved(i)}
        pnl={0}
        tradeCount={0}
        relativeValues={false}
        balance={0}
      />
    );
  }
  return cells;
};
