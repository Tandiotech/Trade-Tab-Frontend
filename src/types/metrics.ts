interface MetricsResponse {
  status: number;
  data: MetricData;
  message: string;
}

export interface MetricData {
  _id: string;
  account: string;
  equity: number;
  freeMargin: number;
  trades: number;
  balance: number;
  highestBalance: number;
  margin: number;
  profit: number;
  highestBalanceDate: Date;
  wonTradesPercent: number;
  lostTradesPercent: number;
  wonTrades: number;
  lostTrades: number;
  averageWin: number;
  averageLoss: number;
  pips: number;
  averageWinPips: number;
  averageLossPips: number;
  bestTrade: number;
  bestTradeDate: Date;
  worstTrade: number;
  worstTradeDate: Date;
  bestTradePips: number;
  bestTradePipsDate: Date;
  worstTradePips: number;
  tradingStartBrokerTime: Date;
  cagr: number;
  longWonTrades: number;
  shortWonTrades: number;
  longTrades: number;
  shortTrades: number;
  longWonTradesPercent: number;
  shortWonTradesPercent: number;
  currencySummary: CurrencySummary[];
  dailyGain: number;
  monthlyGain: number;
  daysSinceTradingStarted: number;
  equityPercent: number;
  expectancy: number;
  expectancyPips: number;
  averageTradeLengthInMilliseconds: number;
  lots: number;
  periods: Periods;
  zScore: number;
  probability: number;
  profitFactor: number;
  totalTradeMarketValue: number;
  deposits: number;
  withdrawals: number;
  absoluteGain: number;
  gain: number;
  dailyGrowth: DailyGrowth[];
  geometricHoldingPeriodReturn: number;
  maxDrawdown: number;
  mar: number;
  monthlyAnalytics: MonthlyAnalytic[];
  closeTradesByWeekDay: { [key: string]: number }[];
  openTradesByHour: { [key: string]: number }[];
  tradeDuration: TradeDuration;
  tradeDurationDiagram: TradeDurationDiagram[];
  averageHoldingPeriodReturn: number;
  kurtosisProfit: number;
  sharpeRatio: number;
  sortinoRatio: number;
  standardDeviationProfit: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CurrencySummary {
  history: History[];
  total: Total;
  short?: Long;
  long: Long;
  currency: string;
}

interface History {
  date: Date;
  totalProfit: number;
  shortProfit?: number;
  shortPips?: number;
  totalPips: number;
  longProfit?: number;
  longPips?: number;
}

interface Long {
  trades: number;
  profit: number;
  pips: number;
}

interface Total {
  trades: number;
  profit: number;
  pips: number;
  wonTrades: number;
  lostTrades?: number;
  wonTradesPercent: number;
  lostTradesPercent?: number;
}

export interface DailyGrowth {
  date: string;
  balance: number;
  drawdownPercentage?: number;
  gains?: number;
  totalGains?: number;
  profit?: number;
  totalProfit?: number;
  lots?: number;
  pips?: number;
  drawdownProfit?: number;
}

interface MonthlyAnalytic {
  date: string;
  currencies: Currency[];
  gains: number;
  profit: number;
  lots: number;
  trades: number;
  pips: number;
}

interface Currency {
  rewardToRiskRatio: number;
  popularityPercent: number;
  currency: string;
  averageHoldingTimeLongsInMilliseconds?: number;
  averageHoldingTimeShortsInMilliseconds?: number;
}

interface Periods {
  today: Today;
  thisWeek: { [key: string]: number };
  thisMonth: { [key: string]: number };
  thisYear: { [key: string]: number };
}

interface Today {
  trades: number;
  tradesDifference: number;
  profitDifference: number;
  lotsDifference: number;
  pipsDifference: number;
  gainDifference: number;
  wonTradesPercentDifference: number;
}

interface TradeDuration {
  lost: Lost[];
  won: Lost[];
}

interface Lost {
  gains: number[];
  profits: number[];
  lots: number[];
  pips?: number[];
  durationInMinutes?: number;
}

interface TradeDurationDiagram {
  durations: number;
  trades: number;
  lost: Lost;
  won?: Lost;
  name: string;
  minDurationInSeconds: number;
  maxDurationInSeconds: number;
}
