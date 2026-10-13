import React, { useState, useMemo, useCallback, memo } from 'react';
import { ITrade } from '@/pages/metrics/interface';
import TradeSymbolVisualizer from '@/component/listTab/Cuentas/TradeSymbolVisualizer';

interface TradeHistoryTableProps {
  trades: ITrade[];
  loading?: boolean;
  className?: string;
  pageSize?: number;
  onTradeClick?: (trade: ITrade) => void;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  search: string;
  symbol: string;
  type: string;
  result: string;
  dateRange: {
    start: string;
    end: string;
  };
}

const TradeHistoryTable: React.FC<TradeHistoryTableProps> = memo(({
  trades,
  loading = false,
  className = '',
  pageSize = 20,
  onTradeClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'openTime', direction: 'desc' });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    search: '',
    symbol: '',
    type: '',
    result: '',
    dateRange: { start: '', end: '' }
  });

  // Get unique values for filter dropdowns
  const uniqueSymbols = useMemo(() => {
    const symbols = [...new Set(trades.map(trade => trade.symbol).filter(Boolean))];
    return symbols.sort();
  }, [trades]);

  const uniqueTypes = useMemo(() => {
    const types = [...new Set(trades.map(trade => trade.type).filter(Boolean))];
    return types.sort();
  }, [trades]);

  // Filter and sort trades
  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade => {
      // Search filter
      if (filterConfig.search) {
        const searchLower = filterConfig.search.toLowerCase();
        const matchesSearch = 
          trade.symbol?.toLowerCase().includes(searchLower) ||
          trade.type?.toLowerCase().includes(searchLower) ||
          trade._id?.toLowerCase().includes(searchLower) ||
          trade.profit?.toString().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Symbol filter
      if (filterConfig.symbol && trade.symbol !== filterConfig.symbol) {
        return false;
      }

      // Type filter
      if (filterConfig.type && trade.type !== filterConfig.type) {
        return false;
      }

      // Result filter
      if (filterConfig.result) {
        if (filterConfig.result === 'profit' && trade.profit <= 0) return false;
        if (filterConfig.result === 'loss' && trade.profit >= 0) return false;
        if (filterConfig.result === 'break-even' && trade.profit !== 0) return false;
      }

      // Date range filter
      if (filterConfig.dateRange.start && trade.openTime) {
        const tradeDate = new Date(trade.openTime);
        const startDate = new Date(filterConfig.dateRange.start);
        if (tradeDate < startDate) return false;
      }
      if (filterConfig.dateRange.end && trade.openTime) {
        const tradeDate = new Date(trade.openTime);
        const endDate = new Date(filterConfig.dateRange.end);
        if (tradeDate > endDate) return false;
      }

      return true;
    });

    // Sort trades
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof ITrade];
      const bValue = b[sortConfig.key as keyof ITrade];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (sortConfig.key.includes('Time')) {
        const aTime = new Date(aValue as string).getTime();
        const bTime = new Date(bValue as string).getTime();
        comparison = aTime - bTime;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [trades, filterConfig, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTrades.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTrades = filteredAndSortedTrades.slice(startIndex, endIndex);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((key: keyof FilterConfig, value: any) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilterConfig({
      search: '',
      symbol: '',
      type: '',
      result: '',
      dateRange: { start: '', end: '' }
    });
    setCurrentPage(1);
  }, []);

  const formatCurrency = useMemo(() => (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }, []);

  const formatDate = useMemo(() => (dateString: string) => {
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
  }, []);

  const formatDuration = useMemo(() => (openTime: string, closeTime: string) => {
    try {
      const open = new Date(openTime);
      const close = new Date(closeTime);
      const diffMs = close.getTime() - open.getTime();
      
      if (diffMs <= 0) return 'N/A';
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      return 'N/A';
    }
  }, []);

  const getSortIcon = useMemo(() => (key: string) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

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

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Trade History</h3>
          <div className="text-sm text-slate-400">
            {filteredAndSortedTrades.length} of {trades.length} trades
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Search</label>
            <input
              type="text"
              value={filterConfig.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search trades..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Symbol</label>
            <select
              value={filterConfig.symbol}
              onChange={(e) => handleFilterChange('symbol', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Symbols</option>
              {uniqueSymbols.map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Type</label>
            <select
              value={filterConfig.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Result</label>
            <select
              value={filterConfig.result}
              onChange={(e) => handleFilterChange('result', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Results</option>
              <option value="profit">Profit</option>
              <option value="loss">Loss</option>
              <option value="break-even">Break Even</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600">
                {[
                  { key: '_id', label: 'Ticket', sortable: true },
                  { key: 'openTime', label: 'Open Time', sortable: true },
                  { key: 'symbol', label: 'Symbol', sortable: true },
                  { key: 'type', label: 'Type', sortable: true },
                  { key: 'volume', label: 'Volume', sortable: true },
                  { key: 'openPrice', label: 'Open Price', sortable: true },
                  { key: 'closeTime', label: 'Close Time', sortable: true },
                  { key: 'closePrice', label: 'Close Price', sortable: true },
                  { key: 'pips', label: 'Pips', sortable: true },
                  { key: 'profit', label: 'Profit', sortable: true },
                  { key: 'duration', label: 'Duration', sortable: false },
                ].map(({ key, label, sortable }) => (
                  <th
                    key={key}
                    className={`px-3 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider ${
                      sortable ? 'cursor-pointer hover:text-white' : ''
                    }`}
                    onClick={sortable ? () => handleSort(key) : undefined}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      {sortable && (
                        <span className="text-slate-500">
                          {getSortIcon(key)}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {currentTrades.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-slate-400">
                    No trades found matching your filters
                  </td>
                </tr>
              ) : (
                currentTrades.map((trade) => (
                  <tr
                    key={trade._id}
                    onClick={() => onTradeClick?.(trade)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors duration-200"
                  >
                    <td className="px-3 py-4 text-sm text-white font-mono">
                      {trade._id}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">
                      {trade.openTime ? formatDate(trade.openTime) : 'N/A'}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <TradeSymbolVisualizer symbol={trade.symbol} />
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300 capitalize">
                      {trade.type?.replace('_', ' ')}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">
                      {trade.volume}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">
                      {trade.openPrice?.toFixed(5)}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">
                      {trade.closeTime ? formatDate(trade.closeTime) : 'N/A'}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">
                      {trade.closePrice?.toFixed(5)}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <span className={trade.pips >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {trade.pips >= 0 ? '+' : ''}{trade.pips?.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-300">
                      {trade.openTime && trade.closeTime 
                        ? formatDuration(trade.openTime, trade.closeTime)
                        : 'N/A'
                      }
                    </td>
                    <td className="px-3 py-4 text-sm">
                      {trade.profit > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                          Profit
                        </span>
                      ) : trade.profit < 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-300">
                          Loss
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                          Break Even
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedTrades.length)} of {filteredAndSortedTrades.length} trades
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                First
              </button>
              
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-sm text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Next
              </button>
              
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-slate-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TradeHistoryTable.displayName = 'TradeHistoryTable';

export default TradeHistoryTable;
