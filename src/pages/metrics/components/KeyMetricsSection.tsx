import { memo } from 'react';
import AccountResume from '../../../component/widget/AccountResume';
import StatCard from '../../../components/ui/StatCard';

export const KeyMetricsSection = memo(
  ({ metricsByDate, currentAccount, metrics, dateStartFilter, dateEndFilter, proModeActivated }:any) => {
    // Calculate Max Historical Drawdown
    const maxHistoricalDrawdown = metrics?.maxDrawdown || 0;
    
    // Format percentage
    const formatPercentage = (value: number): string => {
      return `${Math.abs(value).toFixed(2)}%`;
    };

    return (
      <div className='w-full mb-2'>
        {/* Account Resume Cards */}
        <div className='backdrop-blur-sm tt-card p-2'>
          <AccountResume
            account_currency={currentAccount?.currency}
            metricsByDate={metricsByDate}
            highestBalance={metrics?.highestBalance}
            showData={true}
            averageWin={metrics?.averageWin}
            averageLoss={metrics?.averageLoss}
            deposits={metrics?.deposits}
            averageWinPips={metrics?.averageWinPips}
            averageLossPips={metrics?.averageLossPips}
            dateStartFilter={dateStartFilter}
            dateEndFilter={dateEndFilter}
            className='flex-1'
          />
        </div>

        {/* Max Historical Drawdown - Only show in Pro Mode */}
        {proModeActivated && (
          <div className='mt-4'>
            <div className='flex justify-center'>
              <StatCard
                title='Max Historical Drawdown'
                value={formatPercentage(maxHistoricalDrawdown)}
                variant='error'
                size='md'
                className='bg-red-500/5 border-red-500/20 text-red-400 min-w-[250px]'
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);
