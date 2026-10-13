import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import HoverContainer from '../../../component/HoverContainer';
import MiniJournal from '../../PublicLink/MiniCalendar/MiniJournal';

interface RecentActivitySectionProps {
  trades: any[];
  accounts: any[];
  metrics: any;
  currentAccount: any;
}

export const RecentActivitySection = ({
  trades,
  accounts,
  metrics,
  // currentAccount
}: RecentActivitySectionProps) => {
  // const totalTrades = (metrics?.wonTrades || 0) + (metrics?.lostTrades || 0);
  const absoluteGain = metrics?.absoluteGain || 0;
  // const gain = metrics?.gain || 0;
  const deposits = metrics?.deposits || 0;
  const withdrawals = metrics?.withdrawals || 0;
  const lots = metrics?.lots || 0;
  const totalPips = metrics?.pips || 0;
  // const expectancyPips = metrics?.expectancyPips || 0;
  const maxDrawdown = metrics?.maxDrawdown || 0;
  const mar = metrics?.mar || 0;
  const cagr = metrics?.cagr || 0;

  return (
    <div className='mb-2 tt-metrics-fade-in'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-white mb-2'>
          Account Summary
        </h2>
        <p className='text-sm text-slate-400'>{trades?.length || 0} trades in selected period</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {accounts.length > 0 && (
          <div>
            <HoverContainer
              onCreateLink={() => {
                return '/journal';
              }}
              name='MiniJournal'
            >
              {trades?.length > 1 && (
                <div className='bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 h-full border border-gray-700/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10'>
                  <div className='absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse'></div>
                  <MiniJournal
                    balance={metrics?.balance}
                    TRADES={accounts.length > 0 ? trades : metrics?.tradesArray}
                    cellHeight='h-24'
                    relative={false}
                    displaySeeFullJournal={true}
                  />
                </div>
              )}
            </HoverContainer>
          </div>
        )}

        <div className='space-y-4'>
          <h4 className='text-lg font-medium text-white'>Performance Metrics</h4>
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>Total Gain</div>
                <div className='w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
                {absoluteGain.toFixed(2)}%
              </div>
            </div>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>CAGR</div>
                <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                {cagr.toFixed(2)}%
              </div>
            </div>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>Total Pips</div>
                <div className='w-2 h-2 bg-gradient-to-r from-slate-400 to-pink-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-slate-200 to-pink-400 bg-clip-text text-transparent'>
                {SeparadorDecimal(totalPips.toFixed(0))} pips
                {/* {(totalPips.toFixed(1))} */}
              </div>
            </div>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>Total Lots</div>
                <div className='w-2 h-2 bg-gradient-to-r from-slate-400 to-red-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-slate-200 to-red-400 bg-clip-text text-transparent'>
                {lots.toFixed(2)}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>Max Drawdown</div>
                <div className='w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'>
                {maxDrawdown.toFixed(2)}%
              </div>
            </div>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>MAR Ratio</div>
                <div className='w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
                {mar.toFixed(2)}
              </div>
            </div>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>Deposits</div>
                <div className='w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
                ${SeparadorDecimal(deposits.toFixed(2))}
              </div>
            </div>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-2'>
                <div className='text-sm text-gray-400'>Withdrawals</div>
                <div className='w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full'></div>
              </div>
              <div className='text-xl text-center font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent'>
                ${SeparadorDecimal(withdrawals.toFixed(2))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
