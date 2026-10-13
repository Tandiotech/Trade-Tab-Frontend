import { tradingStatsConfig } from './statsConfig';
import PerformanceStatsGrid from '../../component/performanceStats/PerformanceStatsGrid';
import { informationAboutComponents } from '../../utils/informationAboutComponents';
import type { IMetrics } from '@/pages/metrics/interface';
import '@/pages/shared/TradeTabDesign.css';

export type StatisticsLayout = 'default' | 'sidebar-fill';

export interface StatisticsProps {
  style?: { title?: string };
  metrics?: IMetrics | null;
  account_currency?: string;
  dataMode?: number;
  /** Tailwind max-height utility for the scrollable stats list (default layout only) */
  heightContainer?: string;
  layout?: StatisticsLayout;
}

function Statistics({
  style,
  metrics,
  account_currency = 'USD',
  dataMode = 0,
  heightContainer = 'max-h-[min(52vh,560px)]',
  layout = 'default',
}: StatisticsProps) {
  const tradingStatsData = tradingStatsConfig(
    metrics,
    account_currency,
    dataMode,
    informationAboutComponents
  );

  const isSidebarFill = layout === 'sidebar-fill';

  return (
    <div
      className={
        isSidebarFill
          ? 'flex h-full min-h-0 w-full flex-col rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.02)] px-3 py-3 transition-colors hover:border-[var(--tt-line-2)]'
          : 'flex w-full flex-col rounded-xl border border-[var(--tt-line-1)] bg-[oklch(1_0_0_/0.02)] px-3 py-3 transition-colors hover:border-[var(--tt-line-2)]'
      }
    >
      <div className='mb-2 shrink-0'>
        <p className='tt-kicker mb-1'>Account</p>
        <h2
          className={`tt-title text-base font-semibold md:text-lg lg:text-xl ${style?.title ?? ''}`}
        >
          Trading statistics
        </h2>
      </div>
      <div
        className={
          isSidebarFill
            ? 'custom-scrollbar2 min-h-0 flex-1 overflow-y-auto max-md:max-h-[min(32vh,17.5rem)] md:pr-3'
            : `custom-scrollbar2 overflow-y-auto md:pr-3 ${heightContainer}`
        }
      >
        <PerformanceStatsGrid data={tradingStatsData} />
      </div>
    </div>
  );
}

export default Statistics;
