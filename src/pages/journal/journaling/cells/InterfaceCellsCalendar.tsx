export interface CellsCalendarProps {
  currentMonth: number;
  // tradesHistory: [];
  currentYear: number;
  // highlightedDay: number | null;
  pnlData: Record<number, number>;
  tradesData: Record<number, number>;
  i: number;
  today: Date;
  // setHighlightedDay: React.Dispatch<React.SetStateAction<number | null>>;
  isFutureDate?: boolean;
  balance: number;
  stlPlan: any;
  withdrawalPlanMode: boolean;
  isWithdrawalDate: boolean;
  withdrawalData: any;
  setModalWithdrawal: any;
  setModalEmotional: any;
  setCurrentPosition: any;
  isStartingSLTPlan?: boolean;
  isInSLTPlanPeriod?: boolean;
  currentAccount: any;
  economicEvent: any;
  // Enhanced journal properties
  journalStatus?: 'none' | 'partial' | 'complete';
  journalPriority?: 'low' | 'medium' | 'high';
  hasJournalEntry?: boolean;
  journalData?: any;
  onHover?: (day: number | null) => void;
  isHovered?: boolean;
}
