import type { DailyGrowthItem } from '@/component/charts/balanceChart/interface';
import {
  formatChartNumber,
  formatChartPercent,
  formatCumulativeGainRatio,
} from '@/component/charts/balanceChart/chartLabelUtils';

export interface ChartSummaryChip {
  label: string;
  value: string;
  rangeMin?: string;
  rangeMax?: string;
}

export interface ChartSummaryStats {
  chips: ChartSummaryChip[];
}

export interface ChartSummaryMetrics {
  wonTradesPercent?: number;
  profit?: number;
  [key: string]: unknown;
}

function getValueForFilter(entry: DailyGrowthItem, filter: string): number {
  switch (filter) {
    case 'Profit':
      return entry.profit ?? 0;
    case 'Balance':
      return entry.balance ?? 0;
    case 'Equity':
      if (entry.balance && entry.drawdownProfit) {
        return ((entry.balance - entry.drawdownProfit) * 100) / entry.balance;
      }
      return 0;
    case 'Drawdown':
      return entry.drawdownPercentage ?? 0;
    case 'Lots':
      return entry.lots ?? 0;
    case 'Gains':
      return entry.totalGains ?? 0;
    default:
      return entry.totalGains ?? entry.profit ?? 0;
  }
}

function sortedRows(
  dailyGrowth: DailyGrowthItem[],
  currentFilter: string
): { values: number[]; rows: DailyGrowthItem[] } {
  const rows = [...dailyGrowth]
    .filter(item => !Number.isNaN(new Date(item.date).getTime()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const values = rows.map(item => getValueForFilter(item, currentFilter));
  return { values, rows };
}

function positiveDaysPercent(values: number[]): number {
  if (!values.length) return 0;
  return (values.filter(v => v > 0).length / values.length) * 100;
}

function rangeChip(min: number, max: number, format: (n: number) => string): ChartSummaryChip {
  return {
    label: 'Range',
    value: '',
    rangeMin: format(min),
    rangeMax: format(max),
  };
}

/** Daily increments from cumulative totalGains series */
function dailyGainDeltas(cumulative: number[]): number[] {
  if (cumulative.length < 2) return cumulative.length === 1 ? [cumulative[0]] : [];
  return cumulative.slice(1).map((v, i) => v - cumulative[i]);
}

export function getChartSummaryStats(
  currentFilter: string,
  dailyGrowth: DailyGrowthItem[] | undefined,
  metrics?: ChartSummaryMetrics | null
): ChartSummaryStats | null {
  if (!dailyGrowth?.length) return null;

  const { values } = sortedRows(dailyGrowth, currentFilter);
  if (!values.length) return null;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const latest = values[values.length - 1];

  switch (currentFilter) {
    case 'Balance': {
      const tradeWinRate = metrics?.wonTradesPercent;
      return {
        chips: [
          { label: 'Balance', value: formatChartNumber(latest) },
          { label: 'Avg balance', value: formatChartNumber(avg) },
          {
            label: 'Trade win rate',
            value:
              tradeWinRate != null && !Number.isNaN(tradeWinRate)
                ? formatChartPercent(tradeWinRate)
                : '—',
          },
          rangeChip(min, max, formatChartNumber),
        ],
      };
    }
    case 'Gains': {
      const deltas = dailyGainDeltas(values);
      const avgDaily =
        deltas.length > 0 ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;
      const positiveDeltaDays =
        deltas.length > 0
          ? (deltas.filter(d => d > 0).length / deltas.length) * 100
          : positiveDaysPercent(values);

      return {
        chips: [
          { label: 'Cumulative gain', value: formatCumulativeGainRatio(latest) },
          { label: 'Avg daily gain', value: formatCumulativeGainRatio(avgDaily) },
          { label: 'Positive days', value: formatChartPercent(positiveDeltaDays) },
          rangeChip(min, max, formatCumulativeGainRatio),
        ],
      };
    }
    case 'Profit': {
      const periodNet = values.reduce((a, b) => a + b, 0);
      const accountProfit =
        metrics?.profit != null && !Number.isNaN(Number(metrics.profit))
          ? Number(metrics.profit)
          : periodNet;

      return {
        chips: [
          { label: 'Net profit', value: formatChartNumber(accountProfit) },
          { label: 'Avg / day', value: formatChartNumber(avg) },
          { label: 'Positive days', value: formatChartPercent(positiveDaysPercent(values)) },
          rangeChip(min, max, formatChartNumber),
        ],
      };
    }
    default:
      return {
        chips: [
          { label: 'Latest', value: formatChartNumber(latest) },
          { label: 'Avg', value: formatChartNumber(avg) },
          { label: 'Positive days', value: formatChartPercent(positiveDaysPercent(values)) },
          rangeChip(min, max, formatChartNumber),
        ],
      };
  }
}
