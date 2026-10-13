import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import ProfitBarChart from '../../charts/profitBarChart/ProfitBarChart';
import type { DailyGrowth, MetricData } from '../../../types/metrics';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import '@/pages/shared/TradeTabDesign.css';

export interface ProfitLossProps {
  style: boolean;
  metrics: MetricData;
  dataMode?: number;
  className?: string;
}

const ProfitLoss = (props: ProfitLossProps) => {
  const { metrics, dataMode, style, className = '' } = props;

  const transformMonthlyAnalytics = (monthlyAnalytics: DailyGrowth[]) => {
    return (
      monthlyAnalytics?.map(entry => ({
        date: entry.date,
        value: entry.profit ?? 0,
      })) ?? []
    );
  };

  const summaryStats = useMemo(() => {
    const data = transformMonthlyAnalytics(metrics?.dailyGrowth || []);
    if (!data.length) return null;

    const totalProfit = data.reduce((sum, item) => sum + item.value, 0);
    const positiveDays = data.filter(item => item.value > 0).length;
    const totalDays = data.length;
    const winRate = totalDays > 0 ? (positiveDays / totalDays) * 100 : 0;
    const avgProfit = totalDays > 0 ? totalProfit / totalDays : 0;
    const values = data.map(item => item.value);
    const maxProfit = values.length > 0 ? Math.max(...values) : 0;
    const maxLoss = values.length > 0 ? Math.min(...values) : 0;

    return {
      totalProfit,
      winRate,
      avgProfit,
      maxProfit,
      maxLoss,
    };
  }, [metrics?.dailyGrowth]);

  const titleSize = style
    ? 'text-lg font-bold lg:text-xl'
    : 'text-xl font-bold xl:text-lg 2xl:text-xl';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex min-h-0 w-full max-w-full flex-col gap-4 rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.02)] p-4 transition-colors duration-300 hover:border-[var(--tt-line-2)] md:gap-5 md:p-5 ${className}`}
    >
      <div className='flex shrink-0 flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-4'>
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-[var(--tt-brand-dim)] p-2 text-[var(--tt-brand)]'>
            <BarChart3 className='h-5 w-5 md:h-6 md:w-6' aria-hidden />
          </div>
          <div>
            <p className='tt-kicker mb-0.5'>Performance</p>
            <h3 className={`tt-title ${titleSize}`}>Profit vs loss</h3>
            <p className='tt-subtitle text-xs font-medium'>
              {dataMode === 0 ? 'Absolute values' : 'Percentage change'}
            </p>
          </div>
        </div>

        {summaryStats && (
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              summaryStats.totalProfit >= 0
                ? 'border-[var(--tt-profit)]/35 bg-[var(--tt-profit-dim)] text-[var(--tt-profit)]'
                : 'border-[var(--tt-loss)]/35 bg-[var(--tt-loss-dim)] text-[var(--tt-loss)]'
            }`}
          >
            {summaryStats.totalProfit >= 0 ? (
              <TrendingUp className='h-3.5 w-3.5 shrink-0' aria-hidden />
            ) : (
              <TrendingDown className='h-3.5 w-3.5 shrink-0' aria-hidden />
            )}
            {summaryStats.totalProfit >= 0 ? '+' : ''}$
            {SeparadorDecimal(summaryStats.totalProfit.toFixed(2))}
          </div>
        )}
      </div>

      {summaryStats && (
        <div className='grid shrink-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4'>
          <div className='tt-card flex flex-col border border-[var(--tt-line-1)] p-3 sm:p-3.5'>
            <div className='mb-1 flex items-center gap-2'>
              <DollarSign className='h-3.5 w-3.5 text-[var(--tt-profit)]' aria-hidden />
              <span className='text-xs font-medium text-[var(--tt-fg-3)]'>Win rate</span>
            </div>
            <p className='text-lg font-bold text-[var(--tt-fg-0)]'>{summaryStats.winRate.toFixed(1)}%</p>
          </div>

          <div className='tt-card flex flex-col border border-[var(--tt-line-1)] p-3 sm:p-3.5'>
            <div className='mb-1 flex items-center gap-2'>
              <TrendingUp className='h-3.5 w-3.5 text-[var(--tt-profit)]' aria-hidden />
              <span className='text-xs font-medium text-[var(--tt-fg-3)]'>Best day</span>
            </div>
            <p className='text-lg font-bold text-[var(--tt-profit)]'>
              +{SeparadorDecimal(summaryStats.maxProfit.toFixed(2))}
            </p>
          </div>

          <div className='tt-card flex flex-col border border-[var(--tt-line-1)] p-3 sm:p-3.5'>
            <div className='mb-1 flex items-center gap-2'>
              <TrendingDown className='h-3.5 w-3.5 text-[var(--tt-loss)]' aria-hidden />
              <span className='text-xs font-medium text-[var(--tt-fg-3)]'>Worst day</span>
            </div>
            <p className='text-lg font-bold text-[var(--tt-loss)]'>
              {SeparadorDecimal(summaryStats.maxLoss.toFixed(2))}
            </p>
          </div>

          <div className='tt-card flex flex-col border border-[var(--tt-line-1)] p-3 sm:p-3.5'>
            <div className='mb-1 flex items-center gap-2'>
              <BarChart3 className='h-3.5 w-3.5 text-[var(--tt-brand)]' aria-hidden />
              <span className='text-xs font-medium text-[var(--tt-fg-3)]'>Avg/day</span>
            </div>
            <p
              className={`text-lg font-bold ${
                summaryStats.avgProfit >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
              }`}
            >
              {summaryStats.avgProfit >= 0 ? '+' : ''}$
              {SeparadorDecimal(
                (Number.isFinite(summaryStats.avgProfit) ? summaryStats.avgProfit : 0).toFixed(2)
              )}
            </p>
          </div>
        </div>
      )}

      <div className='flex min-h-0 w-full flex-col pt-1'>
        <div className='h-[min(18rem,36vh)] max-h-[360px] min-h-[200px] w-full sm:h-[min(19rem,38vh)]'>
          <ProfitBarChart
            monthlyAnalytics={transformMonthlyAnalytics(metrics?.dailyGrowth)}
            totalBalance={metrics?.balance}
            dataMode={dataMode}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProfitLoss;
