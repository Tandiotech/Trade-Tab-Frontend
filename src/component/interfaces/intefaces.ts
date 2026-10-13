interface TradeInterface {
  _id: string;
  accountId?: string;
  symbol: string;
  type: string;
  openTime: string;
  closeTime: string;
  openPrice: number;
  closePrice: number;
  pips: number;
  profit: number;
  commission?: number;
  swap?: number;
  isOpen?: boolean;
  success?: string;
  durationInMinutes?: number;
  volume: number;
}

export interface CellTradeListProps {
  trades: TradeInterface[];
}

export interface FeedBackTrackerProps {
  onClose: () => void;
  date_selected: any; // Recibe la fecha seleccionada como prop
  openTrades: any; // Recibe la fecha seleccionada como prop
  existingJournalData?: any; // Existing journal data for the selected date
  onJournalUpdate?: (day: number, data: any) => void; // Callback for journal updates
}
