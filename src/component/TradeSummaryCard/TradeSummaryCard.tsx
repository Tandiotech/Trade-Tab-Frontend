import React, { useMemo, memo } from 'react';
import { ITrade } from '@/pages/metrics/interface';

interface TradeSummaryCardProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
}

interface TradeSummary {
  totalTrades: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  winRate: number;
  lossRate: number;
  bestTrade: number;
  worstTrade: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  totalPips: number;
  averagePips: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  mostTradedSymbol: string;
  mostProfitableSymbol: string;
  totalVolume: number;
  averageTradeSize: number;
}

const TradeSummaryCard: React.FC<TradeSummaryCardProps> = memo(({ 
  trades, 
  loading = false, 
  className = '' 
}) => {
  const summary: TradeSummary = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        winRate: 0,
        lossRate: 0,
        bestTrade: 0,
        worstTrade: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        totalPips: 0,
        averagePips: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakEvenTrades: 0,
        mostTradedSymbol: '',
        mostProfitableSymbol: '',
        totalVolume: 0,
        averageTradeSize: 0,
      };
    }

    const validTrades = trades.filter(trade => 
      trade && 
      typeof trade.profit === 'number' && 
      !isNaN(trade.profit)
    );

    if (validTrades.length === 0) {
      return {
        totalTrades: trades.length,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        winRate: 0,
        lossRate: 0,
        bestTrade: 0,
        worstTrade: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        totalPips: 0,
        averagePips: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakEvenTrades: 0,
        mostTradedSymbol: '',
        mostProfitableSymbol: '',
        totalVolume: 0,
        averageTradeSize: 0,
      };
    }

    // Calculate basic metrics
    const totalTrades = validTrades.length;
    const winningTrades = validTrades.filter(trade => trade.profit > 0);
    const losingTrades = validTrades.filter(trade => trade.profit < 0);
    const breakEvenTrades = validTrades.filter(trade => trade.profit === 0);

    const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profit, 0));
    const netProfit = totalProfit - totalLoss;

    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    const lossRate = totalTrades > 0 ? (losingTrades.length / totalTrades) * 100 : 0;

    const bestTrade = Math.max(...validTrades.map(trade => trade.profit));
    const worstTrade = Math.min(...validTrades.map(trade => trade.profit));

    const averageWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;

    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

    // Calculate pips
    const totalPips = validTrades.reduce((sum, trade) => {
      const pips = trade.pips || 0;
      return sum + (typeof pips === 'number' ? pips : 0);
    }, 0);
    const averagePips = totalTrades > 0 ? totalPips / totalTrades : 0;

    // Calculate volume
    const totalVolume = validTrades.reduce((sum, trade) => {
      const volume = trade.volume || 0;
      return sum + (typeof volume === 'number' ? volume : 0);
    }, 0);
    const averageTradeSize = totalTrades > 0 ? totalVolume / totalTrades : 0;

    // Find most traded symbol
    const symbolCounts = validTrades.reduce((acc, trade) => {
      const symbol = trade.symbol || 'Unknown';
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostTradedSymbol = Object.entries(symbolCounts).reduce((a, b) => 
      symbolCounts[a[0]] > symbolCounts[b[0]] ? a : b, ['', 0]
    )[0];

    // Find most profitable symbol
    const symbolProfits = validTrades.reduce((acc, trade) => {
      const symbol = trade.symbol || 'Unknown';
      acc[symbol] = (acc[symbol] || 0) + trade.profit;
      return acc;
    }, {} as Record<string, number>);

    const mostProfitableSymbol = Object.entries(symbolProfits).reduce((a, b) => 
      symbolProfits[a[0]] > symbolProfits[b[0]] ? a : b, ['', -Infinity]
    )[0];

    return {
      totalTrades,
      totalProfit,
      totalLoss,
      netProfit,
      winRate,
      lossRate,
      bestTrade,
      worstTrade,
      averageWin,
      averageLoss,
      profitFactor,
      totalPips,
      averagePips,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      breakEvenTrades: breakEvenTrades.length,
      mostTradedSymbol,
      mostProfitableSymbol,
      totalVolume,
      averageTradeSize,
    };
  }, [trades]);

  const formatCurrency = useMemo(() => (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }, []);

  const formatPercentage = useMemo(() => (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`;
  }, []);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Trading Summary</h2>
        <div className="text-sm text-slate-400">
          {summary.totalTrades} {summary.totalTrades === 1 ? 'Trade' : 'Trades'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Net Profit</div>
          <div className={`text-lg font-semibold ${summary.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(summary.netProfit)}
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Win Rate</div>
          <div className="text-lg font-semibold text-blue-400">
            {formatPercentage(summary.winRate)}
          </div>
        </div>

        {/* Profit Factor */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Profit Factor</div>
          <div className="text-lg font-semibold text-purple-400">
            {summary.profitFactor === Infinity ? '∞' : summary.profitFactor.toFixed(2)}
          </div>
        </div>

        {/* Total Pips */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Total Pips</div>
          <div className="text-lg font-semibold text-cyan-400">
            {formatCurrency(summary.totalPips, 1)}
          </div>
        </div>

        {/* Best Trade */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Best Trade</div>
          <div className="text-lg font-semibold text-green-400">
            {formatCurrency(summary.bestTrade)}
          </div>
        </div>

        {/* Worst Trade */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Worst Trade</div>
          <div className="text-lg font-semibold text-red-400">
            {formatCurrency(summary.worstTrade)}
          </div>
        </div>

        {/* Average Win */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Avg Win</div>
          <div className="text-lg font-semibold text-green-400">
            {formatCurrency(summary.averageWin)}
          </div>
        </div>

        {/* Average Loss */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Avg Loss</div>
          <div className="text-lg font-semibold text-red-400">
            {formatCurrency(summary.averageLoss)}
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Most Traded Symbol</div>
          <div className="text-lg font-semibold text-yellow-400">
            {summary.mostTradedSymbol || 'N/A'}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Most Profitable Symbol</div>
          <div className="text-lg font-semibold text-emerald-400">
            {summary.mostProfitableSymbol || 'N/A'}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="text-sm text-slate-400 mb-1">Total Volume</div>
          <div className="text-lg font-semibold text-orange-400">
            {formatCurrency(summary.totalVolume, 2)}
          </div>
        </div>
      </div>

      {/* Trade Distribution */}
      <div className="mt-6">
        <div className="text-sm text-slate-400 mb-3">Trade Distribution</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-300">
              {summary.winningTrades} Wins ({formatPercentage(summary.winRate)})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-slate-300">
              {summary.losingTrades} Losses ({formatPercentage(summary.lossRate)})
            </span>
          </div>
          {summary.breakEvenTrades > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-slate-300">
                {summary.breakEvenTrades} Break Even
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TradeSummaryCard.displayName = 'TradeSummaryCard';

export default TradeSummaryCard;
