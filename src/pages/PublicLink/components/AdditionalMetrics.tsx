import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  TriangleAlert,
  Scale,
  RefreshCw,
  ListOrdered,
  CalendarDays,
} from 'lucide-react';
import formatNumber from '@/utils/UtilTools';
import PublicLinkPanel from './PublicLinkPanel';

interface AdditionalMetricsProps {
  dataMetrics: any;
  dataMode: number;
  trades: any[];
}

export default function AdditionalMetrics({ dataMetrics, dataMode, trades }: AdditionalMetricsProps) {
  const metrics = [
    {
      title: 'Win Rate',
      value: `${formatNumber(dataMetrics?.wonTradesPercent) ?? 0}%`,
      Icon: BarChart3,
      valueClass: 'text-[var(--tt-profit)]',
    },
    {
      title: 'Avg Win',
      value:
        dataMode === 1
          ? `${formatNumber(dataMetrics?.averageWinPercent) ?? 0}%`
          : `$${formatNumber(dataMetrics?.averageWin) ?? 0}`,
      Icon: TrendingUp,
      valueClass: 'text-[var(--tt-brand)]',
    },
    {
      title: 'Avg Loss',
      value:
        dataMode === 1
          ? `${formatNumber(dataMetrics?.averageLossPercent) ?? 0}%`
          : `$${formatNumber(dataMetrics?.averageLoss) ?? 0}`,
      Icon: TrendingDown,
      valueClass: 'text-[var(--tt-loss)]',
    },
    {
      title: 'Max Drawdown',
      value:
        dataMode === 1
          ? `${formatNumber(dataMetrics?.maxDrawdownPercent) ?? 0}%`
          : `$${formatNumber(dataMetrics?.maxDrawdown) ?? 0}`,
      Icon: TriangleAlert,
      valueClass: 'text-[var(--tt-fg-2)]',
    },
    {
      title: 'Profit Factor',
      value: formatNumber(dataMetrics?.profitFactor) ?? '0.00',
      Icon: Scale,
      valueClass: 'text-[var(--tt-fg-0)]',
    },
    {
      title: 'Recovery Factor',
      value: formatNumber(dataMetrics?.recoveryFactor) ?? '0.00',
      Icon: RefreshCw,
      valueClass: 'text-[var(--tt-fg-0)]',
    },
  ];

  return (
    <div className='space-y-3'>
      <PublicLinkPanel>
        <h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--tt-fg-0)]'>
          <BarChart3 className='h-4 w-4 shrink-0 text-[var(--tt-brand)]' aria-hidden />
          Key metrics
        </h3>
        <div className='grid grid-cols-2 gap-2'>
          {metrics.map((metric, index) => (
            <div
              key={index}
              className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] p-2 text-center'
            >
              <div className='mb-1 flex items-center justify-center gap-1 text-[10px] text-[var(--tt-fg-3)]'>
                <metric.Icon className='h-3 w-3 shrink-0 opacity-80' aria-hidden />
                <span>{metric.title}</span>
              </div>
              <div className={`text-sm font-semibold tabular-nums ${metric.valueClass}`}>{metric.value}</div>
            </div>
          ))}
        </div>
      </PublicLinkPanel>

      {trades?.length > 0 && (
        <PublicLinkPanel>
          <h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--tt-fg-0)]'>
            <ListOrdered className='h-4 w-4 shrink-0 text-[var(--tt-brand)]' aria-hidden />
            Recent trades
          </h3>

          <div className='space-y-2'>
            {[...trades]
              .sort((a, b) => new Date(b.closeTime).getTime() - new Date(a.closeTime).getTime())
              .slice(0, 10)
              .map((trade, index) => (
                <div
                  key={trade._id || index}
                  className='flex items-center justify-between rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-0)] px-2 py-1.5'
                >
                  <div className='text-xs text-[var(--tt-fg-3)]'>{trade.symbol || 'N/A'}</div>
                  <div
                    className={`text-xs font-semibold tabular-nums ${
                      trade.profit > 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                    }`}
                  >
                    {trade.profit > 0 ? '+' : ''}${formatNumber(trade.profit) || '0.00'}
                  </div>
                </div>
              ))}
          </div>
        </PublicLinkPanel>
      )}

      {dataMetrics?.tradingDays && (
        <PublicLinkPanel>
          <h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--tt-fg-0)]'>
            <CalendarDays className='h-4 w-4 shrink-0 text-[var(--tt-brand)]' aria-hidden />
            Trading activity
          </h3>
          <div className='space-y-2 text-xs text-[var(--tt-fg-3)]'>
            <div className='flex justify-between gap-2'>
              <span>Most active day</span>
              <span className='shrink-0 font-medium text-[var(--tt-fg-0)]'>
                {dataMetrics.mostActiveDay || 'N/A'}
              </span>
            </div>
            <div className='flex justify-between gap-2'>
              <span>Avg trades / day</span>
              <span className='shrink-0 font-medium text-[var(--tt-fg-0)]'>
                {formatNumber(dataMetrics.averageTradesPerDay) || '0'}
              </span>
            </div>
            <div className='flex justify-between gap-2'>
              <span>Consecutive days</span>
              <span className='shrink-0 font-medium text-[var(--tt-fg-0)]'>
                {dataMetrics.consecutiveTradingDays || '0'}
              </span>
            </div>
          </div>
        </PublicLinkPanel>
      )}
    </div>
  );
}
