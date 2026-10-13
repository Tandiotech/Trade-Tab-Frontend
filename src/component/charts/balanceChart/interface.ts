/**
 * Data structure for each item in dailyGrowth
 */
export interface DailyGrowthItem {
  date: string;
  profit?: number;
  balance?: number;
  drawdownProfit?: number;
  drawdownPercentage?: number;
  lots?: number;
  totalGains?: number;
}

/**
 * Data structure for each trade change in tradesBalanceChange
 */
interface ITradesBalanceChangeItem {
  closeTime: string;
  openTime?: string;
  profit: number;
}

/**
 * Props for the PerformanceAreaChart component
 */
export interface PerformanceAreaChartProps {
  dailyGrowth: DailyGrowthItem[];
  /** When true, chart fills parent flex box (metrics dashboard) without viewport min-heights */
  fillParent?: boolean;
  currentFilter?: string; // e.g. "Profit", "Balance", "Equity"
  startDate?: string;
  endDate?: string;
  tradesBalanceChange?: ITradesBalanceChangeItem[];
  account?: string; // or the actual account type if available
  proModeActivated?: boolean; 
  equityHistory?: any[]; 
  equityData?: any[];
}
