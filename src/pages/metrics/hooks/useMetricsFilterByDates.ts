import { useMemo } from 'react';
import { DailyGrowth } from '../../../types/metrics';
import { IFormattedDates, IMetrics } from '../interface';
import { isInRange, toChartDateKey } from '../utils/metricsDateRange';

export interface useMetricsFilterByDatesConfig {
  formattedDates: IFormattedDates;
  metrics: IMetrics | null;
}

function calcRiskReward(growth: DailyGrowth[]): string {
  if (!growth?.length) return 'N/A';
  const wins = growth.filter(g => (g as { profit?: number }).profit! > 0).map(g => (g as { profit: number }).profit);
  const losses = growth
    .filter(g => (g as { profit?: number }).profit! < 0)
    .map(g => Math.abs((g as { profit: number }).profit));
  const avgW = wins.length ? wins.reduce((s, w) => s + w, 0) / wins.length : 0;
  const avgL = losses.length ? losses.reduce((s, l) => s + l, 0) / losses.length : 0;
  if (avgL === 0) return '1.01';
  return (avgW / avgL).toFixed(2);
}

export function useMetricsFilterByDates(config: useMetricsFilterByDatesConfig) {
  const {
    formattedDates: { dateStartFilter: startDate, dateEndFilter: endDate },
    metrics,
  } = config;

  const hasRange = Boolean(startDate && endDate);

  const computed = useMemo(() => {
    if (!metrics?.dailyGrowth?.length) {
      return {
        growth: [] as DailyGrowth[],
        balance: '0.00',
        equity: '0.00',
        equityLabel: 'Equity',
        riskReward: 'N/A',
        isEmptyForRange: false,
      };
    }

    if (!hasRange) {
      const growth = metrics.dailyGrowth;
      return {
        growth,
        balance: Number(metrics.balance ?? 0).toFixed(2),
        equity: Number(metrics.equity ?? 0).toFixed(2),
        equityLabel: 'Equity',
        riskReward: calcRiskReward(growth),
        isEmptyForRange: false,
      };
    }

    const startKey = toChartDateKey(startDate!);
    const endKey = toChartDateKey(endDate!);

    const growth = metrics.dailyGrowth.filter((d: { date: string }) => {
      const key = toChartDateKey(d.date);
      return key && isInRange(key, startKey, endKey);
    });

    if (!growth.length) {
      return {
        growth,
        balance: '0.00',
        equity: '0.00',
        equityLabel: 'Balance at End Date',
        riskReward: 'N/A',
        isEmptyForRange: true,
      };
    }

    const last = growth[growth.length - 1];
    const balance = (last.balance ?? 0).toFixed(2);
    const equity = (last.balance ?? 0).toFixed(2);

    return {
      growth,
      balance,
      equity,
      equityLabel: 'Balance at End Date',
      riskReward: calcRiskReward(growth),
      isEmptyForRange: false,
    };
  }, [metrics, hasRange, startDate, endDate]);

  return {
    balance: computed.balance,
    equity: computed.equity,
    growth: computed.growth,
    equityLabel: computed.equityLabel,
    riskReward: computed.riskReward,
    isEmptyForRange: computed.isEmptyForRange,
  };
}
