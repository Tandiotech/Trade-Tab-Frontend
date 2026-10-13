import { useMemo, memo } from 'react';
import { ITrade } from '@/pages/metrics/interface';

interface MostUsedPairsProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
  maxPairs?: number;
}

interface PairAnalysis {
  symbol: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  bestTrade: number;
  worstTrade: number;
  totalPips: number;
  averagePips: number;
  totalVolume: number;
  averageVolume: number;
  profitFactor: number;
  percentageOfTotalTrades: number;
  percentageOfTotalProfit: number;
}

const MostUsedPairs: React.FC<MostUsedPairsProps> = memo(({ 
  trades, 
  loading = false, 
  className = '',
  maxPairs = 10
}) => {
  const pairAnalysis: PairAnalysis[] = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const validTrades = trades.filter(trade => 
      trade && 
      trade.symbol &&
      typeof trade.profit === 'number' && 
      !isNaN(trade.profit)
    );

    if (validTrades.length === 0) return [];

    // Group trades by symbol
    const symbolGroups = validTrades.reduce((acc, trade) => {
      const symbol = trade.symbol;
      if (!acc[symbol]) {
        acc[symbol] = [];
      }
      acc[symbol].push(trade);
      return acc;
    }, {} as Record<string, ITrade[]>);

    // Calculate total metrics for percentage calculations
    const totalTrades = validTrades.length;
    const totalProfit = validTrades.reduce((sum, trade) => sum + trade.profit, 0);

    // Analyze each symbol
    const analysis = Object.entries(symbolGroups).map(([symbol, symbolTrades]) => {
      const winningTrades = symbolTrades.filter(trade => trade.profit > 0);
      const losingTrades = symbolTrades.filter(trade => trade.profit < 0);
      const breakEvenTrades = symbolTrades.filter(trade => trade.profit === 0);

      const totalProfitForSymbol = winningTrades.reduce((sum, trade) => sum + trade.profit, 0);
      const totalLossForSymbol = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0));
      const netProfitForSymbol = totalProfitForSymbol - totalLossForSymbol;

      const winRate = symbolTrades.length > 0 ? (winningTrades.length / symbolTrades.length) * 100 : 0;
      const averageWin = winningTrades.length > 0 ? totalProfitForSymbol / winningTrades.length : 0;
      const averageLoss = losingTrades.length > 0 ? totalLossForSymbol / losingTrades.length : 0;

      const bestTrade = Math.max(...symbolTrades.map(trade => trade.profit));
      const worstTrade = Math.min(...symbolTrades.map(trade => trade.profit));

      const totalPips = symbolTrades.reduce((sum, trade) => {
        const pips = trade.pips || 0;
        return sum + (typeof pips === 'number' ? pips : 0);
      }, 0);

      const averagePips = symbolTrades.length > 0 ? totalPips / symbolTrades.length : 0;

      const totalVolume = symbolTrades.reduce((sum, trade) => {
        const volume = trade.volume || 0;
        return sum + (typeof volume === 'number' ? volume : 0);
      }, 0);

      const averageVolume = symbolTrades.length > 0 ? totalVolume / symbolTrades.length : 0;

      const profitFactor = totalLossForSymbol > 0 ? totalProfitForSymbol / totalLossForSymbol : totalProfitForSymbol > 0 ? Infinity : 0;

      const percentageOfTotalTrades = (symbolTrades.length / totalTrades) * 100;
      const percentageOfTotalProfit = totalProfit !== 0 ? (netProfitForSymbol / totalProfit) * 100 : 0;

      return {
        symbol,
        totalTrades: symbolTrades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        breakEvenTrades: breakEvenTrades.length,
        totalProfit: totalProfitForSymbol,
        totalLoss: totalLossForSymbol,
        netProfit: netProfitForSymbol,
        winRate,
        averageWin,
        averageLoss,
        bestTrade,
        worstTrade,
        totalPips,
        averagePips,
        totalVolume,
        averageVolume,
        profitFactor,
        percentageOfTotalTrades,
        percentageOfTotalProfit,
      };
    });

    // Sort by total trades (most used first)
    return analysis
      .sort((a, b) => b.totalTrades - a.totalTrades)
      .slice(0, maxPairs);
  }, [trades, maxPairs]);

  const formatCurrency = useMemo(() => (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }, []);

  const formatPercentage = useMemo(() => (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`;
  }, []);

  const getSymbolIcon = useMemo(() => (symbol: string) => {
    const symbolMap: Record<string, string> = {
      'EURUSD': '🇪🇺🇺🇸',
      'GBPUSD': '🇬🇧🇺🇸',
      'USDJPY': '🇺🇸🇯🇵',
      'AUDUSD': '🇦🇺🇺🇸',
      'USDCAD': '🇺🇸🇨🇦',
      'NZDUSD': '🇳🇿🇺🇸',
      'USDCHF': '🇺🇸🇨🇭',
      'EURGBP': '🇪🇺🇬🇧',
      'EURJPY': '🇪🇺🇯🇵',
      'GBPJPY': '🇬🇧🇯🇵',
      'AUDJPY': '🇦🇺🇯🇵',
      'CADJPY': '🇨🇦🇯🇵',
      'CHFJPY': '🇨🇭🇯🇵',
      'NZDJPY': '🇳🇿🇯🇵',
      'EURAUD': '🇪🇺🇦🇺',
      'EURCAD': '🇪🇺🇨🇦',
      'EURNZD': '🇪🇺🇳🇿',
      'GBPAUD': '🇬🇧🇦🇺',
      'GBPCAD': '🇬🇧🇨🇦',
      'GBPNZD': '🇬🇧🇳🇿',
    };
    return symbolMap[symbol] || '💱';
  }, []);

  const getPerformanceColor = useMemo(() => (netProfit: number) => {
    if (netProfit > 0) return 'text-green-400';
    if (netProfit < 0) return 'text-red-400';
    return 'text-gray-400';
  }, []);

  const getWinRateColor = useMemo(() => (winRate: number) => {
    if (winRate >= 70) return 'text-green-400';
    if (winRate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }, []);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pairAnalysis.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Most Used Trading Pairs</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No trading data available</div>
            <p className="text-gray-500 text-sm">Start trading to see your pair analysis here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Most Used Trading Pairs</h3>
          <div className="text-sm text-slate-400">
            Top {pairAnalysis.length} pairs by frequency
          </div>
        </div>

        <div className="space-y-4">
          {pairAnalysis.map((pair, index) => (
            <div
              key={pair.symbol}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                {/* Left side - Symbol and Rank */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                    #{index + 1}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSymbolIcon(pair.symbol)}</span>
                    <div>
                      <div className="text-white font-semibold text-lg">{pair.symbol}</div>
                      <div className="text-xs text-slate-400">
                        {formatPercentage(pair.percentageOfTotalTrades)} of total trades
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Net Profit */}
                <div className="text-right">
                  <div className={`text-lg font-bold ${getPerformanceColor(pair.netProfit)}`}>
                    {pair.netProfit >= 0 ? '+' : ''}{formatCurrency(pair.netProfit)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatPercentage(pair.percentageOfTotalProfit)} of total profit
                  </div>
                </div>
              </div>

              {/* Main metrics row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Total Trades</div>
                  <div className="text-white font-semibold">{pair.totalTrades}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Win Rate</div>
                  <div className={`font-semibold ${getWinRateColor(pair.winRate)}`}>
                    {formatPercentage(pair.winRate)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Avg Pips</div>
                  <div className="text-cyan-400 font-semibold">
                    {pair.averagePips >= 0 ? '+' : ''}{pair.averagePips.toFixed(1)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-1">Profit Factor</div>
                  <div className="text-purple-400 font-semibold">
                    {pair.profitFactor === Infinity ? '∞' : pair.profitFactor.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Detailed breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-2">Trade Breakdown</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-green-400">Wins:</span>
                      <span className="text-white">{pair.winningTrades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-400">Losses:</span>
                      <span className="text-white">{pair.losingTrades}</span>
                    </div>
                    {pair.breakEvenTrades > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Break Even:</span>
                        <span className="text-white">{pair.breakEvenTrades}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-2">Performance</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Best Trade:</span>
                      <span className="text-green-400">+{formatCurrency(pair.bestTrade)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Worst Trade:</span>
                      <span className="text-red-400">{formatCurrency(pair.worstTrade)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Win:</span>
                      <span className="text-green-400">+{formatCurrency(pair.averageWin)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-2">Volume & Pips</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Volume:</span>
                      <span className="text-orange-400">{formatCurrency(pair.totalVolume, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Volume:</span>
                      <span className="text-orange-400">{formatCurrency(pair.averageVolume, 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Pips:</span>
                      <span className="text-cyan-400">
                        {pair.totalPips >= 0 ? '+' : ''}{formatCurrency(pair.totalPips, 1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar for trade frequency */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Trade Frequency</span>
                  <span>{formatPercentage(pair.percentageOfTotalTrades)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(pair.percentageOfTotalTrades, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-slate-400 mb-1">Total Pairs Analyzed</div>
              <div className="text-white font-semibold">{pairAnalysis.length}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 mb-1">Most Profitable</div>
              <div className="text-green-400 font-semibold">
                {pairAnalysis.length > 0 ? pairAnalysis.reduce((best, current) => 
                  current.netProfit > best.netProfit ? current : best
                ).symbol : 'N/A'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 mb-1">Highest Win Rate</div>
              <div className="text-blue-400 font-semibold">
                {pairAnalysis.length > 0 ? pairAnalysis.reduce((best, current) => 
                  current.winRate > best.winRate ? current : best
                ).symbol : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MostUsedPairs.displayName = 'MostUsedPairs';

export default MostUsedPairs;
