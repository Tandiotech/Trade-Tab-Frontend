import { useState } from 'react';
import HoverContainer from '../../../component/HoverContainer';
import MostTradedAssets from '../../../component/MetricsCharts/MostTradedAssets/MostTradedAssets';
import ProfitLoss from '../../../component/MetricsCharts/ProfitLoss/ProfitLoss';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';

interface PerformanceOverviewSectionProps {
  metrics: any;
  trades: any[];
}

export const PerformanceOverviewSection = ({
  metrics,
  trades,
}: PerformanceOverviewSectionProps) => {
  const currencySummary = metrics?.currencySummary || [];
  const bestTrade = metrics?.bestTrade || 0;
  const worstTrade = metrics?.worstTrade || 0;
  const bestTradePips = metrics?.bestTradePips || 0;
  const worstTradePips = metrics?.worstTradePips || 0;
  // const totalPips = metrics?.pips || 0;
  const averageWinPips = metrics?.averageWinPips || 0;
  const averageLossPips = metrics?.averageLossPips || 0;
  const [selected, setSelected] = useState<any | null>(null);
  return (
    <div className='mb-2 pb-2'>
      <div className='grid min-h-0 grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-6'>
        <HoverContainer name='MostTradedAssets' onCreateLink={() => {}}>
          <div className='flex w-full min-h-0 flex-col'>
            <MostTradedAssets metrics={metrics} TRADES={trades} />
          </div>
        </HoverContainer>

        <HoverContainer name='ProfitLoss' cameraIconLocation='top-2 right-2' onCreateLink={() => {}}>
          <div className='flex w-full min-h-0 flex-col'>
            <ProfitLoss metrics={metrics} style={true} className='min-h-0 w-full' />
          </div>
        </HoverContainer>
      </div>

      {/* Currency Performance Summary */}
      {currencySummary.length > 0 && (
        <div className='mt-6'>
          <h3 className='text-lg font-medium text-white mb-4'>Currency Performance</h3>
          <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
            {currencySummary.map((currency: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelected(currency)}
                className='tt-card p-3 border border-slate-700/40 hover:border-teal-600/60 transition text-left'
              >
                <div className='flex items-center justify-between'>
                  <h4 className='text-sm font-semibold text-white'>{currency.currency}</h4>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      currency.total.profit >= 0
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {currency.total.profit >= 0 ? '+' : ''}
                    {SeparadorDecimal(currency.total.profit.toFixed(2))}
                  </span>
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  Trades: {currency.total.trades?.toFixed(0)} · Win:{' '}
                  {currency.total.wonTradesPercent?.toFixed(1)}%
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
          <div className='bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 relative'>
            <button
              onClick={() => setSelected(null)}
              className='absolute top-3 right-3 text-gray-400 hover:text-white'
            >
              ✕
            </button>
            <h3 className='text-xl font-bold text-white mb-4'>{selected.currency} Performance</h3>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Profit:</span>
                <span
                  className={`${selected.total.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {selected.total.profit.toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Trades:</span>
                <span className='text-white'>{selected.total.trades?.toFixed(0)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Win Rate:</span>
                <span className='text-white'>{selected.total.wonTradesPercent?.toFixed(1)}%</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Pips:</span>
                <span className='text-white'>{selected.total.pips?.toFixed(1)}</span>
              </div>
              {/* aquí podrías meter más métricas sin ensuciar la vista principal */}
            </div>
          </div>
        </div>
      )}

      {/* Best/Worst Trades */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='tt-card p-4'>
          <h3 className='text-lg font-medium text-white mb-4'>Best Performance</h3>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Best Trade:</span>
              <span className='text-green-400 font-semibold'>+{SeparadorDecimal(bestTrade?.toFixed(2))}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Best Pips:</span>
              <span className='text-green-400 font-semibold'>+{SeparadorDecimal(bestTradePips?.toFixed(0))} pips</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Avg Win Pips:</span>
              <span className='text-white font-semibold'>{SeparadorDecimal(averageWinPips?.toFixed(0))}</span>
            </div>
          </div>
        </div>

        <div className='tt-card p-4'>
          <h3 className='text-lg font-medium text-white mb-4'>Worst Performance</h3>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Worst Trade:</span>
              <span className='text-red-400 font-semibold'>{SeparadorDecimal(worstTrade?.toFixed(2))}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Worst Pips:</span>
              <span className='text-red-400 font-semibold'>{SeparadorDecimal(worstTradePips?.toFixed(0))} pips</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-gray-400'>Avg Loss Pips:</span>
              <span className='text-white font-semibold'>{SeparadorDecimal(averageLossPips?.toFixed(0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
