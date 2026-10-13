import DynamicTraderChart from '../../component/MetricsCharts/DynamicTraderChart/DynamicChart';
import ProfitLoss from '../../component/MetricsCharts/ProfitLoss/ProfitLoss';
import Statistics from '../statistics/Statistics';
import MiniJournal from './MiniCalendar/MiniJournal';
import MostTradedAssets from '../../component/MetricsCharts/MostTradedAssets/MostTradedAssets';
import { useEffect, useState } from 'react';
import MonthlyPerformance from '../../component/MetricsCharts/MostActiveMonths/MonthlyPerformance';
import '../shared/TradeTabDesign.css';

export default function ChartsAndStatsPublicLink({ dataMetrics, data_mode, trades }: any) {
  const [currentFilter, setCurrentFilter] = useState('Gains');

  useEffect(() => {
    setCurrentFilter('Gains');
  }, [data_mode]);

  return (
    <section className='mx-auto w-full min-w-0 max-w-[1440px] space-y-8'>
      <div>
        <h2 className='tt-page-title text-lg sm:text-xl'>Performance</h2>
        <p className='tt-page-sub mt-0.5'>Equity, gains, and session statistics</p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <div className='col-span-12 lg:col-span-8'>
          <div className='mb-6'>
            <DynamicTraderChart
              style={true}
              metrics={dataMetrics}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              dataMode={data_mode}
            />
          </div>

          <div className='h-full lg:max-h-[600px]'>
            <ProfitLoss style={true} metrics={dataMetrics} dataMode={data_mode} />
          </div>
        </div>

        <div className='col-span-12 lg:col-span-4'>
          <Statistics
            style={true}
            metrics={dataMetrics}
            account_currency={dataMetrics.currency}
            dataMode={data_mode}
          />
        </div>
      </div>

      <div>
        <h2 className='tt-page-title text-lg sm:text-xl'>Rhythm and calendar</h2>
        <p className='tt-page-sub mt-0.5'>Monthly rhythm and day-by-day results</p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='h-full'>
          <MonthlyPerformance
            style={true}
            trades={trades}
            dataMode={data_mode}
            monthlyAnalytics={dataMetrics?.monthlyAnalytics}
          />
        </div>
        <div className='h-full'>
          <MiniJournal cellHeight='h-20' balance={dataMetrics.balance} TRADES={trades} />
        </div>
      </div>

      <div>
        <h2 className='tt-page-title text-lg sm:text-xl'>Distribution</h2>
        <p className='tt-page-sub mt-0.5'>Most traded symbols and exposure</p>
      </div>

      <div>
        <MostTradedAssets style={true} metrics={dataMetrics ?? []} TRADES={trades} />
      </div>
    </section>
  );
}
