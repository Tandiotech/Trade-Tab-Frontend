import { useState, useCallback, useMemo } from 'react';
import { ITrade } from '@/pages/metrics/interface';

// Export functionality
interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  dateRange?: { start: string; end: string };
  includeColumns: string[];
  filters?: any;
}

interface ExportFeatureProps {
  trades: ITrade[];
  filters?: any;
  className?: string;
}

const ExportFeature: React.FC<ExportFeatureProps> = ({ 
  trades, 
  filters, 
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportOptions['format']>('csv');

  const exportTrades = useCallback(async (options: ExportOptions) => {
    setIsExporting(true);
    
    try {
      let data = trades;
      
      // Apply filters if provided
      if (filters) {
        data = applyFiltersToTrades(trades, filters);
      }
      
      // Apply date range if provided
      if (options.dateRange) {
        data = data.filter(trade => {
          const tradeDate = new Date(trade.openTime);
          const startDate = new Date(options.dateRange!.start);
          const endDate = new Date(options.dateRange!.end);
          return tradeDate >= startDate && tradeDate <= endDate;
        });
      }
      
      // Format data based on selected columns
      const formattedData = data.map(trade => {
        const formatted: any = {};
        options.includeColumns.forEach(column => {
          switch (column) {
            case 'ticket':
              formatted['Ticket ID'] = trade._id;
              break;
            case 'symbol':
              formatted['Symbol'] = trade.symbol;
              break;
            case 'type':
              formatted['Type'] = trade.type?.replace('_', ' ').toUpperCase();
              break;
            case 'openTime':
              formatted['Open Time'] = trade.openTime ? new Date(trade.openTime).toLocaleString() : 'N/A';
              break;
            case 'closeTime':
              formatted['Close Time'] = trade.closeTime ? new Date(trade.closeTime).toLocaleString() : 'N/A';
              break;
            case 'openPrice':
              formatted['Open Price'] = trade.openPrice?.toFixed(5) || 'N/A';
              break;
            case 'closePrice':
              formatted['Close Price'] = trade.closePrice?.toFixed(5) || 'N/A';
              break;
            case 'volume':
              formatted['Volume'] = trade.volume || 'N/A';
              break;
            case 'profit':
              formatted['Profit'] = trade.profit?.toFixed(2) || 'N/A';
              break;
            case 'pips':
              formatted['Pips'] = trade.pips?.toFixed(1) || 'N/A';
              break;
            case 'duration':
              if (trade.openTime && trade.closeTime) {
                const duration = calculateDuration(trade.openTime, trade.closeTime);
                formatted['Duration'] = duration;
              } else {
                formatted['Duration'] = 'N/A';
              }
              break;
          }
        });
        return formatted;
      });
      
      // Generate file based on format
      switch (options.format) {
        case 'csv':
          await exportToCSV(formattedData, 'trades.csv');
          break;
        case 'xlsx':
          await exportToXLSX(formattedData, 'trades.xlsx');
          break;
        case 'json':
          await exportToJSON(formattedData, 'trades.json');
          break;
        case 'pdf':
          await exportToPDF(formattedData, 'trades.pdf');
          break;
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [trades, filters]);

  const calculateDuration = (openTime: string, closeTime: string): string => {
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
  };

  const applyFiltersToTrades = (trades: ITrade[], filters: any): ITrade[] => {
    return trades.filter(trade => {
      // Apply the same filtering logic as in TradePage
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          trade.symbol?.toLowerCase().includes(searchLower) ||
          trade.type?.toLowerCase().includes(searchLower) ||
          trade._id?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      if (filters.symbols && filters.symbols.length > 0 && !filters.symbols.includes(trade.symbol)) {
        return false;
      }
      
      if (filters.types && filters.types.length > 0 && !filters.types.includes(trade.type)) {
        return false;
      }
      
      return true;
    });
  };

  const exportToCSV = async (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportToXLSX = async (data: any[], filename: string) => {
    // This would require a library like xlsx
    // For now, we'll fall back to CSV
    await exportToCSV(data, filename.replace('.xlsx', '.csv'));
  };

  const exportToJSON = async (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportToPDF = async (data: any[], filename: string) => {
    // This would require a library like jsPDF
    // For now, we'll fall back to CSV
    await exportToCSV(data, filename.replace('.pdf', '.csv'));
  };

  const availableColumns = [
    { key: 'ticket', label: 'Ticket ID' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'type', label: 'Type' },
    { key: 'openTime', label: 'Open Time' },
    { key: 'closeTime', label: 'Close Time' },
    { key: 'openPrice', label: 'Open Price' },
    { key: 'closePrice', label: 'Close Price' },
    { key: 'volume', label: 'Volume' },
    { key: 'profit', label: 'Profit' },
    { key: 'pips', label: 'Pips' },
    { key: 'duration', label: 'Duration' },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.map(col => col.key)
  );

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleExport = () => {
    exportTrades({
      format: exportFormat,
      includeColumns: selectedColumns,
      filters
    });
  };

  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Export Trades</h3>
        <div className="flex items-center space-x-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportOptions['format'])}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="json">JSON</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.length === 0}
            className="btn-primary text-sm px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Select Columns:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableColumns.map(column => (
              <label key={column.key} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column.key)}
                  onChange={() => handleColumnToggle(column.key)}
                  className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-300">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-slate-500">
          Exporting {trades.length} trades in {exportFormat.toUpperCase()} format
        </div>
      </div>
    </div>
  );
};

// Real-time updates
interface RealTimeUpdatesProps {
  onRefresh: () => void;
  lastUpdate?: Date;
  isUpdating?: boolean;
  className?: string;
}

export const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({
  onRefresh,
  lastUpdate,
  isUpdating = false,
  className = ''
}) => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  const formatLastUpdate = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  // Auto-refresh effect
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Real-time Updates</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isUpdating}
            className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
          >
            {isUpdating ? (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span>🔄</span>
                <span>Refresh</span>
              </div>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-400">Auto-refresh</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {autoRefresh && (
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-400">Interval</label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-white text-sm"
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
        )}
        
        {lastUpdate && (
          <div className="text-xs text-slate-500">
            Last updated: {formatLastUpdate(lastUpdate)}
          </div>
        )}
        
        <div className="text-xs text-slate-500">
          {autoRefresh 
            ? `Auto-refreshing every ${refreshInterval} seconds`
            : 'Manual refresh only'
          }
        </div>
      </div>
    </div>
  );
};

// Trade comparison feature
interface TradeComparisonProps {
  trades: ITrade[];
  onCompare: (trades: ITrade[]) => void;
  className?: string;
}

const TradeComparison: React.FC<TradeComparisonProps> = ({
  trades,
  onCompare,
  className = ''
}) => {
  const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
  const [comparisonMode, setComparisonMode] = useState(false);

  const handleTradeSelect = (tradeId: string) => {
    const newSelected = new Set(selectedTrades);
    if (newSelected.has(tradeId)) {
      newSelected.delete(tradeId);
    } else {
      newSelected.add(tradeId);
    }
    setSelectedTrades(newSelected);
  };

  const handleCompare = () => {
    const tradesToCompare = trades.filter(trade => selectedTrades.has(trade._id));
    onCompare(tradesToCompare);
  };

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (comparisonMode) {
      setSelectedTrades(new Set());
    }
  };

  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Trade Comparison</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleComparisonMode}
            className={`btn-secondary text-sm px-3 py-1 ${
              comparisonMode ? 'bg-blue-600 hover:bg-blue-700' : ''
            }`}
          >
            {comparisonMode ? 'Exit Compare' : 'Compare Trades'}
          </button>
          {comparisonMode && selectedTrades.size >= 2 && (
            <button
              onClick={handleCompare}
              className="btn-primary text-sm px-3 py-1"
            >
              Compare ({selectedTrades.size})
            </button>
          )}
        </div>
      </div>
      
      {comparisonMode && (
        <div className="space-y-3">
          <div className="text-sm text-slate-400">
            Select 2 or more trades to compare
          </div>
          <div className="text-xs text-slate-500">
            {selectedTrades.size} trades selected
          </div>
        </div>
      )}
    </div>
  );
};

// Quick actions toolbar
interface QuickActionsProps {
  onExport: () => void;
  onRefresh: () => void;
  onCompare: () => void;
  isExporting?: boolean;
  isRefreshing?: boolean;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onExport,
  onRefresh,
  onCompare,
  isExporting = false,
  isRefreshing = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
        title="Refresh data"
      >
        {isRefreshing ? (
          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          '🔄'
        )}
      </button>
      
      <button
        onClick={onExport}
        disabled={isExporting}
        className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
        title="Export trades"
      >
        {isExporting ? (
          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          '📊'
        )}
      </button>
      
      <button
        onClick={onCompare}
        className="btn-secondary text-sm px-3 py-1"
        title="Compare trades"
      >
        ⚖️
      </button>
    </div>
  );
};

// Enhanced trade details modal
interface EnhancedTradeDetailsModalProps {
  trade: ITrade | null;
  onClose: () => void;
  onEdit?: (trade: ITrade) => void;
  onDelete?: (tradeId: string) => void;
  className?: string;
}

export const EnhancedTradeDetailsModal: React.FC<EnhancedTradeDetailsModalProps> = ({
  trade,
  onClose,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'analysis' | 'chart'>('details');

  if (!trade) return null;

  const formatCurrency = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateDuration = () => {
    if (!trade.openTime || !trade.closeTime) return 'N/A';
    
    try {
      const open = new Date(trade.openTime);
      const close = new Date(trade.closeTime);
      const diffMs = close.getTime() - open.getTime();
      
      if (diffMs <= 0) return 'N/A';
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch (error) {
      return 'N/A';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const tabs = [
    { key: 'details', label: 'Details', icon: '📋' },
    { key: 'analysis', label: 'Analysis', icon: '📊' },
    { key: 'chart', label: 'Chart', icon: '📈' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h3 className="text-xl font-semibold text-white">Trade Details</h3>
            <p className="text-slate-400 text-sm">{trade.symbol} - {trade._id}</p>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(trade)}
                className="btn-secondary text-sm px-3 py-1"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(trade._id)}
                className="btn-error text-sm px-3 py-1"
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Ticket ID</label>
                  <div className="text-white font-mono text-lg">{trade._id}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Symbol</label>
                  <div className="text-white font-semibold text-lg">{trade.symbol}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Type</label>
                  <div className="text-white capitalize">{trade.type?.replace('_', ' ')}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Volume</label>
                  <div className="text-white">{trade.volume}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Open Time</label>
                  <div className="text-white">{formatDate(trade.openTime)}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Close Time</label>
                  <div className="text-white">{formatDate(trade.closeTime)}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Open Price</label>
                  <div className="text-white text-lg">{trade.openPrice?.toFixed(5)}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Close Price</label>
                  <div className="text-white text-lg">{trade.closePrice?.toFixed(5)}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Pips</label>
                  <div className={`font-semibold text-lg ${getPerformanceColor(trade.pips || 0)}`}>
                    {trade.pips >= 0 ? '+' : ''}{trade.pips?.toFixed(1)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Profit</label>
                  <div className={`font-semibold text-xl ${getPerformanceColor(trade.profit || 0)}`}>
                    {trade.profit >= 0 ? '+' : ''}${formatCurrency(trade.profit || 0)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Duration</label>
                  <div className="text-white">{calculateDuration()}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Result</label>
                  <div className={`font-semibold ${
                    trade.profit > 0 ? 'text-green-400' : 
                    trade.profit < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {trade.profit > 0 ? 'WIN' : trade.profit < 0 ? 'LOSS' : 'BREAK EVEN'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Risk/Reward</div>
                  <div className="text-white font-semibold">
                    {trade.profit && trade.volume ? 
                      (Math.abs(trade.profit) / (trade.volume * 100)).toFixed(2) : 'N/A'
                    }
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Pip Value</div>
                  <div className="text-white font-semibold">
                    ${((trade.profit || 0) / (trade.pips || 1)).toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Price Movement</div>
                  <div className="text-white font-semibold">
                    {trade.openPrice && trade.closePrice ? 
                      ((trade.closePrice - trade.openPrice) / trade.openPrice * 100).toFixed(4) + '%' : 'N/A'
                    }
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Trade Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Strategy:</span>
                    <span className="text-white">{trade.type?.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Movement:</span>
                    <span className={getPerformanceColor((trade.pips || 0) * 10)}>
                      {trade.pips && trade.pips > 0 ? 'Bullish' : trade.pips && trade.pips < 0 ? 'Bearish' : 'Neutral'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trade Quality:</span>
                    <span className={
                      Math.abs(trade.pips || 0) > 50 ? 'text-green-400' :
                      Math.abs(trade.pips || 0) > 20 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {Math.abs(trade.pips || 0) > 50 ? 'Excellent' :
                       Math.abs(trade.pips || 0) > 20 ? 'Good' : 'Poor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Price Chart</h4>
                <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-slate-400 text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <div>Chart visualization would go here</div>
                    <div className="text-sm mt-1">
                      {trade.symbol} from {formatDate(trade.openTime)} to {formatDate(trade.closeTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
