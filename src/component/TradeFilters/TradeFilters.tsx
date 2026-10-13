import React, { useState, useMemo, useCallback, memo } from 'react';
import { ITrade } from '@/pages/metrics/interface';

interface TradeFiltersProps {
  trades: ITrade[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  showAdvanced?: boolean;
}

export interface FilterState {
  search: string;
  symbols: string[];
  types: string[];
  results: string[];
  dateRange: {
    start: string;
    end: string;
  };
  profitRange: {
    min: number | null;
    max: number | null;
  };
  volumeRange: {
    min: number | null;
    max: number | null;
  };
  pipsRange: {
    min: number | null;
    max: number | null;
  };
  durationRange: {
    min: number | null; // in hours
    max: number | null; // in hours
  };
}

const TradeFilters: React.FC<TradeFiltersProps> = memo(({
  trades,
  onFiltersChange,
  className = '',
  showAdvanced = false
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    symbols: [],
    types: [],
    results: [],
    dateRange: { start: '', end: '' },
    profitRange: { min: null, max: null },
    volumeRange: { min: null, max: null },
    pipsRange: { min: null, max: null },
    durationRange: { min: null, max: null }
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const symbols = [...new Set(trades.map(trade => trade.symbol).filter(Boolean))].sort();
    const types = [...new Set(trades.map(trade => trade.type).filter(Boolean))].sort();
    
    // Calculate ranges for numeric filters
    const profits = trades.map(trade => trade.profit).filter(p => typeof p === 'number');
    const volumes = trades.map(trade => trade.volume).filter(v => typeof v === 'number');
    const pips = trades.map(trade => trade.pips).filter(p => typeof p === 'number');
    
    // Calculate durations
    const durations = trades
      .filter(trade => trade.openTime && trade.closeTime)
      .map(trade => {
        try {
          const open = new Date(trade.openTime);
          const close = new Date(trade.closeTime);
          return (close.getTime() - open.getTime()) / (1000 * 60 * 60); // hours
        } catch {
          return 0;
        }
      })
      .filter(d => d > 0);

    return {
      symbols,
      types,
      profitRange: {
        min: profits.length > 0 ? Math.min(...profits) : 0,
        max: profits.length > 0 ? Math.max(...profits) : 0
      },
      volumeRange: {
        min: volumes.length > 0 ? Math.min(...volumes) : 0,
        max: volumes.length > 0 ? Math.max(...volumes) : 0
      },
      pipsRange: {
        min: pips.length > 0 ? Math.min(...pips) : 0,
        max: pips.length > 0 ? Math.max(...pips) : 0
      },
      durationRange: {
        min: durations.length > 0 ? Math.min(...durations) : 0,
        max: durations.length > 0 ? Math.max(...durations) : 0
      }
    };
  }, [trades]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const handleArrayFilterChange = useCallback((key: 'symbols' | 'types' | 'results', value: string, checked: boolean) => {
    const currentArray = filters[key];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray);
  }, [filters, handleFilterChange]);

  const handleRangeFilterChange = useCallback((key: 'profitRange' | 'volumeRange' | 'pipsRange' | 'durationRange', field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const newRange = { ...filters[key], [field]: numValue };
    handleFilterChange(key, newRange);
  }, [filters, handleFilterChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      symbols: [],
      types: [],
      results: [],
      dateRange: { start: '', end: '' },
      profitRange: { min: null, max: null },
      volumeRange: { min: null, max: null },
      pipsRange: { min: null, max: null },
      durationRange: { min: null, max: null }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.symbols.length > 0) count++;
    if (filters.types.length > 0) count++;
    if (filters.results.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.profitRange.min !== null || filters.profitRange.max !== null) count++;
    if (filters.volumeRange.min !== null || filters.volumeRange.max !== null) count++;
    if (filters.pipsRange.min !== null || filters.pipsRange.max !== null) count++;
    if (filters.durationRange.min !== null || filters.durationRange.max !== null) count++;
    return count;
  }, [filters]);

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Trade Filters</h3>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search trades..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range Start */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range End */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Advanced Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              {isAdvancedOpen ? 'Hide Advanced' : 'Show Advanced'}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="space-y-6">
            {/* Symbol Filters */}
            <div>
              <label className="block text-sm text-slate-300 mb-3">Symbols</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {filterOptions.symbols.map(symbol => (
                  <label key={symbol} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.symbols.includes(symbol)}
                      onChange={(e) => handleArrayFilterChange('symbols', symbol, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300">{symbol}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <label className="block text-sm text-slate-300 mb-3">Trade Types</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {filterOptions.types.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={(e) => handleArrayFilterChange('types', type, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-300 capitalize">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Result Filters */}
            <div>
              <label className="block text-sm text-slate-300 mb-3">Results</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'profit', label: 'Profit', color: 'text-green-400' },
                  { value: 'loss', label: 'Loss', color: 'text-red-400' },
                  { value: 'break-even', label: 'Break Even', color: 'text-gray-400' }
                ].map(result => (
                  <label key={result.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.results.includes(result.value)}
                      onChange={(e) => handleArrayFilterChange('results', result.value, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${result.color}`}>{result.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Numeric Range Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Profit Range */}
              <div>
                <label className="block text-sm text-slate-300 mb-3">Profit Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min profit"
                    value={filters.profitRange.min || ''}
                    onChange={(e) => handleRangeFilterChange('profitRange', 'min', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max profit"
                    value={filters.profitRange.max || ''}
                    onChange={(e) => handleRangeFilterChange('profitRange', 'max', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Volume Range */}
              <div>
                <label className="block text-sm text-slate-300 mb-3">Volume Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Min volume"
                    value={filters.volumeRange.min || ''}
                    onChange={(e) => handleRangeFilterChange('volumeRange', 'min', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Max volume"
                    value={filters.volumeRange.max || ''}
                    onChange={(e) => handleRangeFilterChange('volumeRange', 'max', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Pips Range */}
              <div>
                <label className="block text-sm text-slate-300 mb-3">Pips Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min pips"
                    value={filters.pipsRange.min || ''}
                    onChange={(e) => handleRangeFilterChange('pipsRange', 'min', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max pips"
                    value={filters.pipsRange.max || ''}
                    onChange={(e) => handleRangeFilterChange('pipsRange', 'max', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Duration Range */}
              <div>
                <label className="block text-sm text-slate-300 mb-3">Duration (hours)</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Min hours"
                    value={filters.durationRange.min || ''}
                    onChange={(e) => handleRangeFilterChange('durationRange', 'min', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Max hours"
                    value={filters.durationRange.max || ''}
                    onChange={(e) => handleRangeFilterChange('durationRange', 'max', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Filter Presets */}
        <div className="mt-6 pt-4 border-t border-slate-600">
          <label className="block text-sm text-slate-300 mb-3">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                handleFilterChange('dateRange', { start: today, end: today });
              }}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Today
            </button>
            <button
              onClick={() => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const today = new Date().toISOString().split('T')[0];
                handleFilterChange('dateRange', { start: weekAgo.toISOString().split('T')[0], end: today });
              }}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const monthAgo = new Date();
                monthAgo.setDate(monthAgo.getDate() - 30);
                const today = new Date().toISOString().split('T')[0];
                handleFilterChange('dateRange', { start: monthAgo.toISOString().split('T')[0], end: today });
              }}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                handleFilterChange('results', ['profit']);
              }}
              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Profitable Only
            </button>
            <button
              onClick={() => {
                handleFilterChange('results', ['loss']);
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Losses Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TradeFilters.displayName = 'TradeFilters';

export default TradeFilters;
