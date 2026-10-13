import type { StlPlanLike } from '../journalCellState';
import type { JournalDayEntry } from '../hooks/useJournalMonth';

export type { StlPlanLike, JournalDayEntry };

export interface PlCalendarProps {
  journalData: JournalDayEntry[];
  balance?: number;
  withdrawalPlanMode: boolean;
  stlPlan: StlPlanLike;
  currentAccount?: {
    _id?: string;
    external_id?: string;
    balance?: number;
    currency?: string;
  };
  economicCalendarData?: Array<{ date: string; event: string; importance: string }>;
}
