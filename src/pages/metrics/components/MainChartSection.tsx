import Statistics from '@/pages/statistics/Statistics';
import { IGrowth, ITrade, MainChartSectionProps } from '../interface';
import { safeGet, SafeSection } from '@/lib/utils';
import DynamicTraderChart from '@/component/MetricsCharts/DynamicTraderChart/DynamicChart';
import type { DailyGrowthItem, PerformanceAreaChartProps } from '@/component/charts/balanceChart/interface';

export const MainChartSection: React.FC<MainChartSectionProps> = ({
  metrics,
  growth,
  currentFilter,
  setCurrentFilter,
  dateStartFilter,
  dateEndFilter,
  trades,
  currentAccount,
  equityHistory,
  equityData,
  proModeActivated = false,
}) => {
  const safeTrades: ITrade[] = Array.isArray(trades) ? trades : [];
  const safeGrowth: IGrowth = Array.isArray(growth) ? growth : [];

  return (
    <SafeSection sectionName='MainChartSection'>
      <div className='tt-metrics-chart-row'>
        <div className='tt-metrics-chart-row__col tt-metrics-chart-row__col--stats'>
          <SafeSection sectionName='Statistics'>
            <Statistics
              layout='sidebar-fill'
              account_currency={safeGet(currentAccount, 'currency', 'USD')}
              metrics={metrics}
            />
          </SafeSection>
        </div>

        <div className='tt-metrics-chart-row__col tt-metrics-chart-row__col--chart'>
          <SafeSection sectionName='DynamicTraderChart'>
            <DynamicTraderChart
              layout='fill'
              metrics={{
                ...metrics,
                dailyGrowth: safeGrowth as unknown as DailyGrowthItem[],
              }}
              currentFilter={currentFilter || 'Balance'}
              setCurrentFilter={setCurrentFilter || (() => {})}
              dateStartFilter={dateStartFilter ?? undefined}
              dateEndFilter={dateEndFilter ?? undefined}
              equityData={equityData}
              equityHistory={equityHistory}
              proModeActivated={proModeActivated}
              tradesBalanceChange={
                safeTrades?.filter(
                  (trade: ITrade) =>
                    trade && typeof trade === 'object' && trade.type === 'DEAL_TYPE_BALANCE'
                ) as unknown as PerformanceAreaChartProps['tradesBalanceChange']
              }
            />
          </SafeSection>
        </div>
      </div>
    </SafeSection>
  );
};
