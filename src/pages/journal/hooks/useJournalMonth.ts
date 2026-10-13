import { useMemo } from 'react';
import {
  getLastActivityFromJournalEntries,
  monthHasTradingActivity,
} from '../journalCellState';

export type JournalDayEntry = {
  date: string;
  totalProfit: number;
  totalTrades: number;
  trades?: unknown[];
};

export type JournalMonthData = {
  pnlByDay: Record<number, number>;
  tradesByDay: Record<number, number>;
  tradesHistoryByDay: Record<number, unknown[]>;
  totalPnl: number;
  lastActivityDate: { year: number; month: number; day: number } | null;
  hasActivityInMonth: boolean;
  daysWithJournal: number[];
};

export function useJournalMonth(
  journalData: JournalDayEntry[],
  currentMonth: number,
  currentYear: number
): JournalMonthData {
  return useMemo(() => {
    const pnlByDay: Record<number, number> = {};
    const tradesByDay: Record<number, number> = {};
    const tradesHistoryByDay: Record<number, unknown[]> = {};
    let totalPnl = 0;

    journalData.forEach(entry => {
      const [year, month, day] = entry.date.split(' ')[0].split('-').map(Number);
      if (month === currentMonth && year === currentYear) {
        pnlByDay[day] = entry.totalProfit;
        tradesByDay[day] = entry.totalTrades;
        tradesHistoryByDay[day] = entry.trades ?? [];
        totalPnl += entry.totalProfit;
      }
    });

    const lastActivityDate = getLastActivityFromJournalEntries(journalData);
    const hasActivityInMonth = monthHasTradingActivity(pnlByDay, tradesByDay);

    return {
      pnlByDay,
      tradesByDay,
      tradesHistoryByDay,
      totalPnl,
      lastActivityDate,
      hasActivityInMonth,
      daysWithJournal: [],
    };
  }, [journalData, currentMonth, currentYear]);
}
