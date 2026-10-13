import Filter from '@/component/forms/Filter';
import { motion, type Variants } from 'framer-motion';
import {
  Activity,
  BarChart3,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { LegendChart } from './LegendChart';
import { headerVariants as defaultHeaderVariants } from '../utils';
import type { DailyGrowthItem } from '../../../charts/balanceChart/interface';
import type { ChartSummaryStats } from '../utils/chartSummaryStats';

export type { ChartSummaryStats };

export interface DynamicChartMetrics {
  dailyGrowth?: DailyGrowthItem[];
  account?: string | number;
  wonTradesPercent?: number;
  [key: string]: unknown;
}

interface FilterVisual {
  icon: typeof Activity;
  tileClass: string;
  iconClass: string;
}

function getFilterVisual(filter: string): FilterVisual {
  switch (filter) {
    case 'Profit':
      return {
        icon: DollarSign,
        tileClass: 'bg-[var(--tt-profit-dim)] ring-1 ring-[var(--tt-profit)]/25',
        iconClass: 'text-[var(--tt-profit)]',
      };
    case 'Balance':
      return {
        icon: BarChart3,
        tileClass: 'bg-[var(--tt-brand-dim)] ring-1 ring-[var(--tt-brand)]/20',
        iconClass: 'text-[var(--tt-brand)]',
      };
    case 'Gains':
      return {
        icon: TrendingUp,
        tileClass: 'bg-[var(--tt-profit-dim)] ring-1 ring-[var(--tt-profit)]/20',
        iconClass: 'text-[var(--tt-profit)]',
      };
    case 'Drawdown':
      return {
        icon: TrendingDown,
        tileClass: 'bg-[var(--tt-loss-dim)] ring-1 ring-[var(--tt-loss)]/25',
        iconClass: 'text-[var(--tt-loss)]',
      };
    default:
      return {
        icon: Activity,
        tileClass: 'bg-[var(--tt-brand-dim)] ring-1 ring-[var(--tt-brand)]/20',
        iconClass: 'text-[var(--tt-brand)]',
      };
  }
}

export default function DynamicChartHeader({
  metrics,
  currentFilter,
  setCurrentFilter,
  style = true,
  menu_options,
  summaryStats,
  showBalanceLegend = false,
  headerVariants = defaultHeaderVariants,
  proModeActivated = false,
}: {
  metrics: DynamicChartMetrics;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  style?: boolean;
  menu_options: string[];
  summaryStats: ChartSummaryStats | null;
  showBalanceLegend?: boolean;
  headerVariants?: Variants;
  proModeActivated?: boolean;
}) {
  const filterVisual = getFilterVisual(currentFilter);
  const FilterIcon = filterVisual.icon;

  const titleSize = style
    ? 'text-lg sm:text-xl lg:text-2xl'
    : 'text-xl sm:text-2xl xl:text-xl 2xl:text-2xl';

  return (
    <motion.div
      variants={headerVariants}
      initial='hidden'
      animate='visible'
      className='tt-chart-header-mobile z-10 mb-2 w-full min-w-0 max-w-full md:mb-6'
    >
      <div className='tt-chart-header__top mb-2 flex w-full min-w-0 max-w-full flex-row items-center justify-between gap-2 md:mb-4 md:flex-col md:items-start md:gap-4 lg:flex-row lg:items-center lg:gap-6'>
        <div className='tt-chart-header__title-block flex min-w-0 max-w-[55%] flex-shrink items-center gap-2 md:max-w-[min(100%,22rem)] md:gap-3 lg:gap-4'>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 24 }}
            className={`tt-chart-header__icon flex-shrink-0 rounded-xl p-2.5 sm:rounded-2xl sm:p-3.5 ${filterVisual.tileClass}`}
          >
            <FilterIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${filterVisual.iconClass}`} aria-hidden />
          </motion.div>
          <div className='min-w-0 flex-1'>
            <p className='tt-kicker mb-0.5'>Performance</p>
            <h2 className={`tt-chart-header__title tt-title truncate font-bold leading-tight ${titleSize}`}>
              {proModeActivated ? 'Dynamic ' : ''}Trader chart
            </h2>
            <p className='tt-subtitle truncate text-xs font-medium leading-tight sm:text-sm'>
              {currentFilter} analysis and performance tracking
            </p>
          </div>
        </div>

        <div className='flex w-auto min-w-0 shrink-0 flex-col items-stretch justify-end gap-2 md:w-full lg:w-auto lg:flex-row lg:items-center lg:gap-3'>
          <div className='w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.03)] p-1 lg:w-auto lg:min-w-0 lg:max-w-md'>
            <Filter
              options={menu_options}
              dailyGrowth={(metrics?.dailyGrowth ?? []) as any}
              currentFilter={currentFilter}
              setcurrentFilter={setCurrentFilter}
            />
          </div>

          {/* {showBalanceLegend && (
            <div className='hidden min-w-0 shrink-0 lg:block'>
              <LegendChart />
            </div>
          )} */}
        </div>
      </div>

      {summaryStats && (
        <div className='tt-chart-header__stats mb-2 grid grid-cols-2 gap-2 min-[520px]:grid-cols-4 md:mb-5 md:gap-3'>
          {summaryStats.chips.map(chip => (
            <div
              key={chip.label}
              className='tt-chart-header__stat tt-mono min-w-0 rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] px-2 py-1.5 text-[10px] text-[var(--tt-fg-2)] sm:px-3 sm:text-xs md:text-sm'
            >
              <span className='text-[var(--tt-fg-3)]'>{chip.label} </span>
              {chip.rangeMin != null && chip.rangeMax != null ? (
                <div className='min-w-0 truncate font-semibold sm:inline'>
                  <span className='text-[var(--tt-loss)]'>{chip.rangeMin}</span>
                  <span className='text-[var(--tt-fg-3)]'> / </span>
                  <span className='text-[var(--tt-profit)]'>{chip.rangeMax}</span>
                </div>
              ) : (
                <span className='block truncate font-semibold text-[var(--tt-fg-0)] sm:inline'>
                  {chip.value}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {showBalanceLegend && (
        <div className='tt-chart-header__legend -mt-1 lg:hidden'>
          <LegendChart />
        </div>
      )}
    </motion.div>
  );
}
