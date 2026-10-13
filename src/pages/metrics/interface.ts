import { ReactNode } from 'react';

// Type definitions
export interface ITrade {
  type: string;
  profit: number;
  [key: string]: any;
}

export interface IAccount {
  _id?: string;
  id?: string;
  currency?: string;
  broker?: string;
  brokerId?: string;
  type?: string;
  [key: string]: any;
}

export interface IMetrics {
  dailyGain?: number;
  account?: number;
  monthlyGain?: number;
  daysSinceTradingStarted?: number;
  equityPercent?: number;
  probability?: number;
  zScore?: number;
  totalTradeMarketValue?: number;
  averageTradeLengthInMilliseconds?: number;
  [key: string]: any;
}

export interface IGrowth {
  [key: string]: any;
}

export interface MetricsByDate {
  growth?: IGrowth;
  [key: string]: any;
}

export interface IFormattedDates {
  dateStartFilter: string | null;
  dateEndFilter: string | null;
  [key: string]: any;
}

export interface BrokerData {
  name: string;
  id: string;
}

export interface UserData {
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface SafeSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName: string;
}

export interface MainChartSectionProps {
  metrics: IMetrics | null;
  growth: IGrowth;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  dateStartFilter: string | null;
  dateEndFilter: string | null;
  trades: ITrade[];
  currentAccount: IAccount | null;
  proModeActivated?: boolean;
  equityHistory?: any[];
  equityData?: any;
}

export interface AdvancedAnalyticsSectionProps {
  metrics: IMetrics | null;
}

export interface RecentTradesSectionProps {
  trades: ITrade[];
  tradesLoading: boolean;
}
