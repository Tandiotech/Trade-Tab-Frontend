import { useState, useMemo } from 'react';
import { ITrade } from '@/pages/metrics/interface';
import { RecentTradesSection } from '@/pages/metrics/components/RecentTradesSection';
import '@/pages/shared/TradeTabDesign.css';
import {
  BarChart3,
  Wallet,
  Target,
  Trophy,
  Inbox,
  ChevronRight,
  LineChart,
  Star,
  TrendingDown,
} from 'lucide-react';

interface TradePageMinimalProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
}

/**
 * TradePageMinimal - Minimal version without complex context dependencies
 */
const TradePageMinimal: React.FC<TradePageMinimalProps> = ({
  trades,
  loading = false,
  className = '',
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'history'>('overview');
  const [tradesPerPage] = useState(25);

  // Helper function to convert deal types to readable labels
  const getTradeTypeLabel = (type: string) => {
    switch (type) {
      case 'DEAL_TYPE_BUY':
        return 'Buy';
      case 'DEAL_TYPE_SELL':
        return 'Sell';
      case 'BUY':
        return 'Buy';
      case 'SELL':
        return 'Sell';
      default:
        return type;
    }
  };

  // Helper function to check if trade is a buy order
  const isBuyOrder = (type: string) => {
    return type === 'DEAL_TYPE_BUY' || type === 'BUY';
  };

  // Enhanced trade summary calculation
  const tradeSummary = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        totalProfit: 0,
        winRate: 0,
        bestTrade: null,
        worstTrade: null,
        bestPair: null,
        worstPair: null,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        totalPips: 0
      };
    }

    // Filter out balance-related trades (deposits/withdrawals)
    const actualTrades = trades.filter(trade => trade.type !== 'DEAL_TYPE_BALANCE');
    const totalTrades = actualTrades.length;
    const totalProfit = actualTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const winningTrades = actualTrades.filter(trade => (trade.profit || 0) > 0);
    const losingTrades = actualTrades.filter(trade => (trade.profit || 0) < 0);
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    
    const bestTrade = actualTrades.length > 0 ? actualTrades.reduce((best, trade) => 
      (trade.profit || 0) > (best.profit || 0) ? trade : best, actualTrades[0]) : null;
    const worstTrade = actualTrades.length > 0 ? actualTrades.reduce((worst, trade) => 
      (trade.profit || 0) < (worst.profit || 0) ? trade : worst, actualTrades[0]) : null;

    // Calculate best/worst pairs
    const pairStats = actualTrades.reduce((acc, trade) => {
      const symbol = trade.symbol || 'Unknown';
      if (!acc[symbol]) {
        acc[symbol] = { count: 0, totalProfit: 0, trades: [] };
      }
      acc[symbol].count++;
      acc[symbol].totalProfit += (trade.profit || 0);
      acc[symbol].trades.push(trade);
      return acc;
    }, {} as Record<string, { count: number; totalProfit: number; trades: ITrade[] }>);

    const bestPair = Object.entries(pairStats).reduce((best, [symbol, stats]) => 
      stats.totalProfit > (best?.totalProfit || -Infinity) ? { symbol, ...stats } : best, 
      null as { symbol: string; count: number; totalProfit: number; trades: ITrade[] } | null
    );

    const worstPair = Object.entries(pairStats).reduce((worst, [symbol, stats]) => 
      stats.totalProfit < (worst?.totalProfit || Infinity) ? { symbol, ...stats } : worst, 
      null as { symbol: string; count: number; totalProfit: number; trades: ITrade[] } | null
    );

    // Calculate additional metrics
    const averageWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0) / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? 
      losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0) / losingTrades.length : 0;
    
    const grossProfit = winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    const totalPips = actualTrades.reduce((sum, trade) => sum + (trade.pips || 0), 0);

    return {
      totalTrades,
      totalProfit,
      winRate,
      bestTrade,
      worstTrade,
      bestPair,
      worstPair,
      averageWin,
      averageLoss,
      profitFactor,
      totalPips
    };
  }, [trades]);

  // Filter out balance-related trades for display
  const actualTrades = trades.filter(trade => trade.type !== 'DEAL_TYPE_BALANCE');
  
  // `tradesPerPage` is shown in the history header; row pagination is handled inside RecentTradesSection.

  const handleViewChange = (view: 'overview' | 'analytics' | 'history') => {
    setActiveView(view);
  };

  if (loading) {
    return (
      <div className={`min-h-screen tt-theme ${className}`}>
        <div className='tt-shell py-10'>
          <div className='py-16 text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[var(--tt-line-2)] border-t-[var(--tt-brand)]' />
            <p className='text-[var(--tt-fg-2)]'>Loading trades…</p>
          </div>
        </div>
      </div>
    );
  }

  const tabBtn = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      active
        ? 'bg-[var(--tt-brand-dim)] text-[var(--tt-fg-0)]'
        : 'text-[var(--tt-fg-2)] hover:text-[var(--tt-fg-0)]'
    }`;

  const thClass =
    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--tt-fg-2)] sm:px-6';

  return (
    <div className={`min-h-screen tt-theme ${className}`}>
      <div className='sticky top-0 z-40 border-b border-[var(--tt-line-1)] bg-[oklch(0.11_0.012_250_/0.72)] backdrop-blur-md'>
        <div className='tt-shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='tt-kicker mb-1'>Trades</p>
            <h1 className='tt-title text-2xl font-bold tracking-tight'>Trade dashboard</h1>
            <p className='tt-subtitle mt-1 text-sm'>Your trading performance overview</p>
          </div>

          <div className='flex items-center gap-2 rounded-lg border border-[var(--tt-line-2)] bg-[oklch(1_0_0_/0.03)] p-1'>
            <button type='button' onClick={() => handleViewChange('overview')} className={tabBtn(activeView === 'overview')}>
              Overview
            </button>
            <button type='button' onClick={() => handleViewChange('history')} className={tabBtn(activeView === 'history')}>
              History
            </button>
          </div>
        </div>
      </div>

      <div className='tt-shell py-8'>
        {actualTrades.length === 0 ? (
          <div className='tt-card py-16 text-center'>
            <Inbox className='mx-auto mb-4 h-14 w-14 text-[var(--tt-fg-3)]' aria-hidden />
            <h2 className='tt-title text-xl font-semibold'>No trades found</h2>
            <p className='tt-subtitle mt-2 text-sm'>No trading data available for the selected period.</p>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Trade Summary Cards */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Total trades</p>
                    <p className='tt-title text-2xl font-bold text-[var(--tt-fg-0)]'>{tradeSummary.totalTrades}</p>
                  </div>
                  <BarChart3 className='h-9 w-9 shrink-0 text-[var(--tt-fg-3)]' aria-hidden />
                </div>
              </div>

              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Total profit</p>
                    <p
                      className={`tt-title text-2xl font-bold ${
                        tradeSummary.totalProfit >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                      }`}
                    >
                      ${tradeSummary.totalProfit.toFixed(2)}
                    </p>
                  </div>
                  <Wallet className='h-9 w-9 shrink-0 text-[var(--tt-fg-3)]' aria-hidden />
                </div>
              </div>

              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Win rate</p>
                    <p className='tt-title text-2xl font-bold text-[var(--tt-fg-0)]'>{tradeSummary.winRate.toFixed(1)}%</p>
                  </div>
                  <Target className='h-9 w-9 shrink-0 text-[var(--tt-fg-3)]' aria-hidden />
                </div>
              </div>

              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Best trade</p>
                    <p
                      className={`tt-title text-2xl font-bold ${
                        (tradeSummary.bestTrade?.profit || 0) >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                      }`}
                    >
                      ${(tradeSummary.bestTrade?.profit || 0).toFixed(2)}
                    </p>
                  </div>
                  <Trophy className='h-9 w-9 shrink-0 text-[var(--tt-fg-3)]' aria-hidden />
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Best pair</p>
                    <p className='tt-title text-lg font-bold text-[var(--tt-fg-0)]'>{tradeSummary.bestPair?.symbol || 'N/A'}</p>
                    <p
                      className={`text-sm ${
                        (tradeSummary.bestPair?.totalProfit || 0) >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                      }`}
                    >
                      ${(tradeSummary.bestPair?.totalProfit || 0).toFixed(2)}
                    </p>
                  </div>
                  <Star className='h-9 w-9 shrink-0 text-[var(--tt-fg-3)]' aria-hidden />
                </div>
              </div>

              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Profit factor</p>
                    <p className='tt-title text-2xl font-bold text-[var(--tt-fg-0)]'>{tradeSummary.profitFactor.toFixed(2)}</p>
                  </div>
                  <BarChart3 className='h-9 w-9 shrink-0 text-[var(--tt-fg-3)]' aria-hidden />
                </div>
              </div>

              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Avg win</p>
                    <p className='tt-title text-2xl font-bold text-[var(--tt-profit)]'>${tradeSummary.averageWin.toFixed(2)}</p>
                  </div>
                  <BarChart3 className='h-9 w-9 shrink-0 text-[var(--tt-profit)]' aria-hidden />
                </div>
              </div>

              <div className='tt-card p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-[var(--tt-fg-3)]'>Avg loss</p>
                    <p className='tt-title text-2xl font-bold text-[var(--tt-loss)]'>${tradeSummary.averageLoss.toFixed(2)}</p>
                  </div>
                  <TrendingDown className='h-9 w-9 shrink-0 text-[var(--tt-loss)]' aria-hidden />
                </div>
              </div>
            </div>

            {/* Content based on active view */}
            {activeView === 'overview' && (
              <div className='space-y-8'>
                {/* Best Trades */}
                <div className='tt-card p-6'>
                  <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <h3 className='tt-title text-xl font-bold'>Top best trades</h3>
                      <p className='tt-subtitle mt-1 text-sm'>Your most profitable trading positions</p>
                    </div>
                    <div className='text-left sm:text-right'>
                      <div className='text-sm text-[var(--tt-fg-3)]'>Showing</div>
                      <div className='text-lg font-semibold text-[var(--tt-fg-0)]'>Top 15</div>
                    </div>
                  </div>

                  <div className='overflow-x-auto rounded-lg border border-[var(--tt-line-1)]'>
                    <table className='w-full'>
                      <thead className='bg-[var(--tt-bg-2)]'>
                        <tr>
                          <th className={`${thClass} text-center`}>Rank</th>
                          <th className={thClass}>Symbol</th>
                          <th className={`${thClass} text-center`}>Type</th>
                          <th className={`${thClass} text-right`}>Volume</th>
                          <th className={`${thClass} text-right`}>Profit</th>
                          <th className={`${thClass} text-right`}>Pips</th>
                          <th className={thClass}>Date</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-[var(--tt-line-1)]'>
                        {actualTrades
                          .sort((a, b) => (b.profit || 0) - (a.profit || 0))
                          .slice(0, 15)
                          .map((trade, index) => (
                            <tr
                              key={trade._id || index}
                              className='transition-colors duration-150 hover:bg-[oklch(1_0_0_/0.03)]'
                            >
                              <td className='px-4 py-4 text-center sm:px-6'>
                                <span
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                    index === 0
                                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                                      : index === 1
                                        ? 'bg-zinc-400 text-white shadow-lg shadow-zinc-400/25'
                                        : index === 2
                                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                                          : 'bg-[var(--tt-bg-3)] text-[var(--tt-fg-1)]'
                                  }`}
                                >
                                  {index + 1}
                                </span>
                              </td>
                              <td className='px-4 py-4 sm:px-6'>
                                <span className='font-medium text-[var(--tt-fg-0)]'>{trade.symbol}</span>
                              </td>
                              <td className='px-4 py-4 text-center sm:px-6'>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    isBuyOrder(trade.type)
                                      ? 'bg-[oklch(0.22_0.08_145_/0.35)] text-[var(--tt-profit)]'
                                      : 'bg-[oklch(0.22_0.12_25_/0.35)] text-[var(--tt-loss)]'
                                  }`}
                                >
                                  {getTradeTypeLabel(trade.type)}
                                </span>
                              </td>
                              <td className='px-4 py-4 text-right sm:px-6'>
                                <span className='font-medium text-[var(--tt-fg-0)]'>{trade.volume}</span>
                              </td>
                              <td className='px-4 py-4 text-right sm:px-6'>
                                <span className='font-semibold text-[var(--tt-profit)]'>${(trade.profit || 0).toFixed(2)}</span>
                              </td>
                              <td className='px-4 py-4 text-right sm:px-6'>
                                <span
                                  className={`font-medium ${
                                    (trade.pips || 0) >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                                  }`}
                                >
                                  {trade.pips?.toFixed(1) || 'N/A'}
                                </span>
                              </td>
                              <td className='px-4 py-4 sm:px-6'>
                                <span className='text-sm text-[var(--tt-fg-2)]'>
                                  {trade.openTime ? new Date(trade.openTime).toLocaleDateString() : 'N/A'}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {actualTrades.length > 15 && (
                    <div className='mt-6 border-t border-[var(--tt-line-1)] pt-4'>
                      <div className='text-center'>
                        <p className='mb-3 text-sm text-[var(--tt-fg-3)]'>
                          Showing top 15 trades out of {actualTrades.length} total trades
                        </p>
                        <button
                          type='button'
                          onClick={() => handleViewChange('history')}
                          className='tt-btn tt-btn-ghost tt-btn-sm inline-flex items-center gap-2'
                        >
                          View complete history
                          <ChevronRight className='h-4 w-4' aria-hidden />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Most Used Pairs */}
                <div className='tt-card p-6'>
                  <h3 className='tt-title mb-4 text-lg font-semibold'>Most used trading pairs</h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {Object.entries(
                      actualTrades.reduce(
                        (acc, trade) => {
                          const symbol = trade.symbol || 'Unknown';
                          if (!acc[symbol]) {
                            acc[symbol] = { count: 0, totalProfit: 0, wins: 0, losses: 0 };
                          }
                          acc[symbol].count++;
                          acc[symbol].totalProfit += trade.profit || 0;
                          if ((trade.profit || 0) > 0) acc[symbol].wins++;
                          else if ((trade.profit || 0) < 0) acc[symbol].losses++;
                          return acc;
                        },
                        {} as Record<string, { count: number; totalProfit: number; wins: number; losses: number }>
                      )
                    )
                      .sort(([, a], [, b]) => b.count - a.count)
                      .slice(0, 6)
                      .map(([symbol, stats]) => (
                        <div key={symbol} className='rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)] p-4'>
                          <div className='mb-2 flex items-center justify-between'>
                            <h4 className='font-semibold text-[var(--tt-fg-0)]'>{symbol}</h4>
                            <span className='text-sm text-[var(--tt-fg-3)]'>{stats.count} trades</span>
                          </div>
                          <div className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <span className='text-[var(--tt-fg-3)]'>Profit:</span>
                              <span
                                className={`font-medium ${
                                  stats.totalProfit >= 0 ? 'text-[var(--tt-profit)]' : 'text-[var(--tt-loss)]'
                                }`}
                              >
                                ${stats.totalProfit.toFixed(2)}
                              </span>
                            </div>
                            <div className='flex justify-between text-sm'>
                              <span className='text-[var(--tt-fg-3)]'>Win rate:</span>
                              <span className='text-[var(--tt-fg-0)]'>
                                {stats.count > 0 ? ((stats.wins / stats.count) * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'analytics' && (
              <div className='space-y-8'>
                <div className='tt-card p-6'>
                  <h3 className='tt-title mb-4 text-lg font-semibold'>Profit / loss over time</h3>
                  <div className='flex h-64 items-center justify-center rounded-lg border border-[var(--tt-line-1)] bg-[var(--tt-bg-2)]'>
                    <div className='text-center'>
                      <LineChart className='mx-auto mb-2 h-12 w-12 text-[var(--tt-fg-3)]' aria-hidden />
                      <p className='text-[var(--tt-fg-2)]'>Chart visualization would go here</p>
                      <p className='mt-1 text-sm text-[var(--tt-fg-3)]'>Total trades: {actualTrades.length}</p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='tt-card p-6'>
                    <h3 className='tt-title mb-4 text-lg font-semibold'>Performance breakdown</h3>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-[var(--tt-fg-3)]'>Total pips:</span>
                        <span className='font-medium text-[var(--tt-fg-0)]'>{tradeSummary.totalPips.toFixed(1)}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-[var(--tt-fg-3)]'>Average win:</span>
                        <span className='font-medium text-[var(--tt-profit)]'>${tradeSummary.averageWin.toFixed(2)}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-[var(--tt-fg-3)]'>Average loss:</span>
                        <span className='font-medium text-[var(--tt-loss)]'>${tradeSummary.averageLoss.toFixed(2)}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-[var(--tt-fg-3)]'>Profit factor:</span>
                        <span className='font-medium text-[var(--tt-fg-0)]'>{tradeSummary.profitFactor.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className='tt-card p-6'>
                    <h3 className='tt-title mb-4 text-lg font-semibold'>Best / worst pairs</h3>
                    <div className='space-y-4'>
                      <div>
                        <div className='mb-1 flex items-center justify-between'>
                          <span className='text-[var(--tt-fg-3)]'>Best pair:</span>
                          <span className='font-medium text-[var(--tt-fg-0)]'>{tradeSummary.bestPair?.symbol || 'N/A'}</span>
                        </div>
                        <div className='text-sm text-[var(--tt-profit)]'>
                          ${(tradeSummary.bestPair?.totalProfit || 0).toFixed(2)} ({tradeSummary.bestPair?.count || 0}{' '}
                          trades)
                        </div>
                      </div>
                      <div>
                        <div className='mb-1 flex items-center justify-between'>
                          <span className='text-[var(--tt-fg-3)]'>Worst pair:</span>
                          <span className='font-medium text-[var(--tt-fg-0)]'>{tradeSummary.worstPair?.symbol || 'N/A'}</span>
                        </div>
                        <div className='text-sm text-[var(--tt-loss)]'>
                          ${(tradeSummary.worstPair?.totalProfit || 0).toFixed(2)} ({tradeSummary.worstPair?.count || 0}{' '}
                          trades)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'history' && (
              <div className='space-y-8'>
                <div className='tt-card p-6'>
                  <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <h3 className='tt-title text-xl font-bold'>Trade history</h3>
                      <p className='tt-subtitle mt-1 text-sm'>Your trading performance overview</p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='text-right'>
                        <div className='text-sm text-[var(--tt-fg-3)]'>Total trades</div>
                        <div className='text-lg font-semibold text-[var(--tt-fg-0)]'>{actualTrades.length}</div>
                      </div>
                      <div className='h-8 w-px bg-[var(--tt-line-1)]' />
                      <div className='text-right'>
                        <div className='text-sm text-[var(--tt-fg-3)]'>Per page</div>
                        <div className='text-lg font-semibold text-[var(--tt-fg-0)]'>{tradesPerPage}</div>
                      </div>
                    </div>
                  </div>

                  <RecentTradesSection />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradePageMinimal;
