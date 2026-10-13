import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import PieContainer from '../../../component/revenueFlow/PieContainer';

interface WinLossAnalysisSectionProps {
  metrics: any;
}

export const WinLossAnalysisSection = ({ metrics }: WinLossAnalysisSectionProps) => {
  const totalTrades = (metrics?.wonTrades || 0) + (metrics?.lostTrades || 0);
  const winRate = totalTrades > 0 ? ((metrics?.wonTrades || 0) / totalTrades) * 100 : 0;
  const profitFactor = metrics?.profitFactor || 0;
  const expectancy = metrics?.expectancy || 0;
  const sharpeRatio = metrics?.sharpeRatio || 0;
  const sortinoRatio = metrics?.sortinoRatio || 0;

  return (
    <div className='mb-2 tt-metrics-fade-in'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='relative'>
          <PieContainer
            symbolData={[metrics?.longWonTrades ?? 0, metrics?.shortWonTrades ?? 0]}
            symbolName={['Long', 'Short']}
            title={`Long/${'\n'}Short Won`}
            title1='Longs Won:'
            title2='Shorts Won:'
            backgroundColor={['#fbbf24', '#3b82f6']}
          />
        </div>

        <div className='relative'>
          <PieContainer
            symbolData={[metrics?.wonTrades ?? 0, metrics?.lostTrades ?? 0]}
            symbolName={['Won', 'Lost']}
            title='Win/Loss'
            title1='Won Trades:'
            title2='Lost Trades:'
            backgroundColor={['#10b981', '#ef4444']}
          />
        </div>

        <div className='group relative'>
          <div className='tt-card h-full border border-gray-700/30 p-6'>
            <div className='space-y-6'>
              <div className='text-center'>
                <div className='text-4xl font-bold text-[var(--tt-profit)]'>{winRate.toFixed(1)}%</div>
                <div className='text-sm text-[var(--tt-fg-3)]'>Win Rate</div>
                <div className='mt-1 text-xs text-[var(--tt-fg-3)]'>
                  {metrics?.wonTrades || 0} wins / {totalTrades} total
                </div>
              </div>
              <div className='border-t border-[var(--tt-line-1)] pt-4 text-center'>
                <div className='text-2xl font-bold text-[var(--tt-fg-0)]'>{profitFactor.toFixed(2)}</div>
                <div className='text-sm text-[var(--tt-fg-3)]'>Profit Factor</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-semibold text-[var(--tt-fg-0)]'>{expectancy.toFixed(2)}</div>
                <div className='text-sm text-[var(--tt-fg-3)]'>Expectancy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='tt-card border border-[var(--tt-line-1)] p-4'>
          <div className='mb-2 text-sm text-[var(--tt-fg-3)]'>Sharpe Ratio</div>
          <div className='text-center text-xl font-bold text-[var(--tt-fg-0)]'>{sharpeRatio.toFixed(2)}</div>
        </div>
        <div className='tt-card border border-[var(--tt-line-1)] p-4'>
          <div className='mb-2 text-sm text-[var(--tt-fg-3)]'>Sortino Ratio</div>
          <div className='text-center text-xl font-bold text-[var(--tt-fg-0)]'>{sortinoRatio.toFixed(2)}</div>
        </div>
        <div className='tt-card border border-[var(--tt-line-1)] p-4'>
          <div className='mb-2 text-sm text-[var(--tt-fg-3)]'>Avg Win</div>
          <div className='text-center text-xl font-bold text-[var(--tt-profit)]'>
            {metrics?.averageWin ? SeparadorDecimal(metrics.averageWin.toFixed(2)) : '0'}
          </div>
        </div>
        <div className='tt-card border border-[var(--tt-line-1)] p-4'>
          <div className='mb-2 text-sm text-[var(--tt-fg-3)]'>Avg Loss</div>
          <div className='text-center text-xl font-bold text-[var(--tt-loss)]'>
            {metrics?.averageLoss ? SeparadorDecimal(metrics.averageLoss.toFixed(2)) : '0'}
          </div>
        </div>
      </div>
    </div>
  );
};
