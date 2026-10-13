import React, { useMemo, memo, useCallback } from 'react';
import { ITrade } from '@/pages/metrics/interface';

interface BestTradesTableProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
  maxTrades?: number;
}

interface EnhancedTrade extends ITrade {
  rank: number;
  profitPercentage?: number;
  duration?: string;
  formattedOpenTime?: string;
  formattedCloseTime?: string;
}

const BestTradesTable: React.FC<BestTradesTableProps> = memo(({ 
  trades, 
  loading = false, 
  className = '',
  maxTrades = 10
}) => {
  const bestTrades: EnhancedTrade[] = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const validTrades = trades.filter(trade => 
      trade && 
      typeof trade.profit === 'number' && 
      !isNaN(trade.profit) &&
      trade.profit > 0 // Only profitable trades
    );

    // Sort by profit in descending order and take top trades
    const sortedTrades = validTrades
      .sort((a, b) => b.profit - a.profit)
      .slice(0, maxTrades);

    return sortedTrades.map((trade, index) => {
      // Calculate duration if both open and close times exist
      let duration = 'N/A';
      if (trade.openTime && trade.closeTime) {
        try {
          const openTime = new Date(trade.openTime);
          const closeTime = new Date(trade.closeTime);
          const diffMs = closeTime.getTime() - openTime.getTime();
          
          if (diffMs > 0) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 0) {
              duration = `${hours}h ${minutes}m`;
            } else {
              duration = `${minutes}m`;
            }
          }
        } catch (error) {
          console.error('Error calculating duration:', error);
        }
      }

      // Format dates
      const formatDate = (dateString: string) => {
        try {
          return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (error) {
          return dateString;
        }
      };

      return {
        ...trade,
        rank: index + 1,
        duration,
        formattedOpenTime: trade.openTime ? formatDate(trade.openTime) : 'N/A',
        formattedCloseTime: trade.closeTime ? formatDate(trade.closeTime) : 'N/A',
      };
    });
  }, [trades, maxTrades]);

  const formatCurrency = useMemo(() => (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }, []);

  const formatPips = useMemo(() => (pips: number) => {
    return pips > 0 ? `+${pips.toFixed(1)}` : pips.toFixed(1);
  }, []);

  const getRankBadgeColor = useMemo(() => (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-900';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100';
      default: return 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200';
    }
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
    };
    return symbolMap[symbol] || '💱';
  }, []);

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (bestTrades.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Best Trades</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No profitable trades found</div>
            <p className="text-gray-500 text-sm">Start trading to see your best performances here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Best Trades</h3>
          <div className="text-sm text-slate-400">
            Top {bestTrades.length} profitable trades
          </div>
        </div>

        <div className="space-y-3">
          {bestTrades.map((trade) => (
            <div
              key={trade._id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Left side - Rank and Symbol */}
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(trade.rank)}`}>
                    #{trade.rank}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSymbolIcon(trade.symbol)}</span>
                    <div>
                      <div className="text-white font-medium">{trade.symbol}</div>
                      <div className="text-xs text-slate-400 capitalize">
                        {trade.type?.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Trade Details */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs">Volume</div>
                    <div className="text-white font-medium">{trade.volume}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-slate-400 text-xs">Duration</div>
                    <div className="text-white font-medium">{trade.duration}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-slate-400 text-xs">Pips</div>
                    <div className="text-green-400 font-medium">{formatPips(trade.pips || 0)}</div>
                  </div>
                </div>

                {/* Right side - Profit */}
                <div className="text-right">
                  <div className="text-green-400 text-lg font-bold">
                    +{formatCurrency(trade.profit)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {trade.formattedCloseTime}
                  </div>
                </div>
              </div>

              {/* Additional details row */}
              <div className="mt-3 pt-3 border-t border-slate-600">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-4">
                    <span>Open: {trade.formattedOpenTime}</span>
                    <span>Close: {trade.formattedCloseTime}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Open Price: {trade.openPrice?.toFixed(5)}</span>
                    <span>Close Price: {trade.closePrice?.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-400">
              Total profit from top {bestTrades.length} trades:
            </div>
            <div className="text-green-400 font-semibold">
              +{formatCurrency(bestTrades.reduce((sum, trade) => sum + trade.profit, 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

BestTradesTable.displayName = 'BestTradesTable';

export default BestTradesTable;
