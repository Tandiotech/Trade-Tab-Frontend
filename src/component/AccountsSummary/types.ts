export type AccountStatus = 'ok' | 'warning' | 'error';

export interface EnrichedAccount {
  _id: string;
  external_id: string;
  name: string;
  mt: 'MT4' | 'MT5';
  number: string;
  broker: string;
  currency: string;
  balance: number;
  platform: string;
  equity?: number;
  leverage?: string;
  margin?: number;
  marginMode?: string;
  type?: string;
  updatedAt?: string;
  realizedPnl?: number;
  trades?: number;
  winRate?: number;
  maxDrawdown?: number;
  lastUpdated?: string;
  status: AccountStatus;
  isPrimary?: boolean;
}
