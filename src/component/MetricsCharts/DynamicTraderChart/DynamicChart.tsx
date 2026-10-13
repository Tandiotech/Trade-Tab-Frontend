import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart } from 'lucide-react';
import ProfitBarChart from '../../charts/profitBarChart/ProfitBarChart';
import Loader1 from '../../loader/Loader1';
import AnimatedText from '../../AnimateText';
import PerformanceAreaChart from '../../charts/balanceChart/PerformanceAreaChart';
import DynamicChartHeader from './components/DynamicChartHeader';
import type { DynamicChartMetrics } from './components/DynamicChartHeader';
import { getChartSummaryStats } from './utils/chartSummaryStats';
import type { DailyGrowthItem, PerformanceAreaChartProps } from '../../charts/balanceChart/interface';
import { containerVariants, headerVariants } from './utils';
import '@/pages/shared/TradeTabDesign.css';

export interface DynamicTraderChartProps {
  style?: boolean;
  metrics?: DynamicChartMetrics | null;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  dateStartFilter?: string;
  dateEndFilter?: string;
  dataMode?: number;
  heightConteiner?: string;
  heightConteinerChart?: string;
  tradesBalanceChange?: PerformanceAreaChartProps['tradesBalanceChange'];
  equityHistory?: PerformanceAreaChartProps['equityHistory'];
  equityData?: PerformanceAreaChartProps['equityData'];
  proModeActivated?: boolean;
  /** Dashboard metrics row: stretch to parent height */
  layout?: 'default' | 'fill';
}

function transformMonthlyAnalytics(monthlyAnalytics: DailyGrowthItem[] | undefined) {
  return (
    monthlyAnalytics?.map(entry => ({
      date: entry.date != null ? String(entry.date) : '',
      value: entry.profit ?? 0,
    })) ?? []
  );
}

const DynamicTraderChart = (props: DynamicTraderChartProps) => {
  const {
    style,
    metrics,
    currentFilter,
    setCurrentFilter,
    dateStartFilter,
    dateEndFilter,
    dataMode,
    heightConteiner = 'h-[90vh]',
    heightConteinerChart = 'h-[60vh]',
    tradesBalanceChange = [],
    equityHistory = [],
    equityData = [],
    proModeActivated = false,
    layout = 'default',
  } = props;

  const isFillLayout = layout === 'fill';
  const containerHeightClass = isFillLayout
    ? 'flex h-auto min-h-0 flex-col md:h-full'
    : heightConteiner;
  const chartHeightClass = isFillLayout
    ? 'tt-metrics-chart-pane flex min-h-0 flex-1 flex-col overflow-hidden md:max-h-full'
    : `flex-1 ${heightConteinerChart}`;

  const summaryStats = useMemo(
    () =>
      getChartSummaryStats(currentFilter, metrics?.dailyGrowth, metrics ?? undefined),
    [metrics, currentFilter]
  );

  const showBalanceLegend = tradesBalanceChange.length > 0;

  if (!metrics) {
    return (
      <div className='flex h-full min-h-[12rem] w-full flex-col items-center justify-center gap-2 text-[var(--tt-fg-2)]'>
        <Loader1 />
        <p className='tt-subtitle text-sm'>Loading chart…</p>
      </div>
    );
  }

  const menu_options = dataMode === 1 ? ['Gains'] : ['Balance', 'Gains', 'Profit'];

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className={`flex w-full min-w-0 max-w-full flex-col rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.02)] transition-colors duration-300 hover:border-[var(--tt-line-2)] ${isFillLayout ? 'max-h-none gap-2 p-2 max-md:gap-2 max-md:p-2.5 md:h-full md:max-h-full md:gap-3 md:p-4' : 'gap-4 p-4 md:p-6'} ${containerHeightClass}`}
    >
      <div className={isFillLayout ? 'shrink-0' : undefined}>
        <DynamicChartHeader
          summaryStats={summaryStats}
          showBalanceLegend={showBalanceLegend}
          style={style}
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          menu_options={menu_options}
          metrics={metrics}
          proModeActivated={proModeActivated}
          headerVariants={headerVariants}
        />
      </div>

      <motion.div className={chartHeightClass}>
        <AnimatePresence mode='wait'>
          {metrics?.dailyGrowth && metrics.dailyGrowth.length > 0 ? (
            currentFilter === 'Profit' ? (
              <motion.div
                key='profit'
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className='flex h-full min-h-0 w-full max-h-full items-end'
              >
                <ProfitBarChart
                  monthlyAnalytics={transformMonthlyAnalytics(metrics?.dailyGrowth)}
                />
              </motion.div>
            ) : (
              <motion.div
                key='performance'
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className='h-full min-h-0 max-h-full w-full'
              >
                <PerformanceAreaChart
                  fillParent={isFillLayout}
                  currentFilter={currentFilter}
                  proModeActivated={proModeActivated}
                  equityHistory={equityHistory}
                  equityData={equityData}
                  dailyGrowth={(metrics?.dailyGrowth ?? []) as DailyGrowthItem[]}
                  startDate={dateStartFilter}
                  endDate={dateEndFilter}
                  tradesBalanceChange={tradesBalanceChange}
                  account={metrics?.account as PerformanceAreaChartProps['account']}
                />
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className='flex h-full flex-col items-center justify-center gap-3 text-center'
            >
              <div className='rounded-full border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-4'>
                <LineChart className='h-8 w-8 text-[var(--tt-fg-3)] sm:h-9 sm:w-9' aria-hidden />
              </div>
              <AnimatedText value={'No data to show'} />
              <p className='tt-subtitle text-sm'>Start trading to see your performance data</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DynamicTraderChart;
